 import { Request, Response } from "express";
 import db from "../config/db";

 /**
  * Extend Request to include JWT user
  */
 interface AuthRequest extends Request {
   user?: {
     id: number;
     role: string;
   };
 }

 /**
  * --------------------------------------------------
  * DONOR → Create Contribution
  * (PARTIAL donation + TRANSACTION SAFE)
  * --------------------------------------------------
  */
 export const createContribution = async (req: AuthRequest, res: Response) => {
   const connection = await db.getConnection();

   try {
     // 🔐 Only donors allowed
     if (!req.user || req.user.role !== "DONOR") {
       return res.status(403).json({ message: "Only donors can contribute" });
     }

     const donorId = req.user.id;
     const { donation_id, quantity } = req.body;

     if (!donation_id || !quantity || quantity <= 0) {
       return res
         .status(400)
         .json({ message: "Donation ID and valid quantity required" });
     }

     await connection.beginTransaction();

     /**
      * 1️⃣ Lock donation row to prevent race conditions
      */
     const [rows]: any = await connection.query(
       `
      SELECT remaining_quantity
      FROM donations
      WHERE id = ?
      FOR UPDATE
      `,
       [donation_id]
     );

     if (rows.length === 0) {
       await connection.rollback();
       return res.status(404).json({ message: "Donation not found" });
     }

     const remaining = rows[0].remaining_quantity;

     if (remaining <= 0) {
       await connection.rollback();
       return res
         .status(400)
         .json({ message: "Donation already fully contributed" });
     }

     if (quantity > remaining) {
       await connection.rollback();
       return res.status(400).json({
         message: `Only ${remaining} quantity remaining`,
       });
     }

     /**
      * 2️⃣ Reduce remaining quantity
      */
     await connection.query(
       `
      UPDATE donations
      SET remaining_quantity = remaining_quantity - ?
      WHERE id = ?
      `,
       [quantity, donation_id]
     );

     /**
      * 3️⃣ Save contribution record
      */
     await connection.query(
       `
      INSERT INTO contributions (donation_id, donor_id, quantity)
      VALUES (?, ?, ?)
      `,
       [donation_id, donorId, quantity]
     );

     /**
      * 4️⃣ Auto-confirm donation if fully fulfilled
      */
     if (remaining - quantity === 0) {
       await connection.query(
         `
        UPDATE donations
        SET status = 'CONFIRMED'
        WHERE id = ?
        `,
         [donation_id]
       );
     }

     await connection.commit();

     return res.status(201).json({
       message: "Contribution added successfully",
     });
   } catch (error) {
     await connection.rollback();
     console.error("CREATE CONTRIBUTION ERROR:", error);
     return res.status(500).json({ message: "Server error" });
   } finally {
     connection.release();
   }
 };

 /**
  * --------------------------------------------------
  * DONOR → View My Contributions
  * (Includes pickup date + status)
  * --------------------------------------------------
  */
 export const getMyContributions = async (req: AuthRequest, res: Response) => {
   try {
     if (!req.user) {
       return res.status(401).json({ message: "Unauthorized" });
     }

     const donorId = req.user.id;

     const [rows] = await db.query(
       `
      SELECT
        c.quantity,
        d.donation_type,
        d.location,
        p.pickup_date_time,
        d.status
      FROM contributions c
      JOIN donations d ON d.id = c.donation_id
      LEFT JOIN pickups p ON p.donation_id = d.id
      WHERE c.donor_id = ?
      ORDER BY c.contributed_at DESC
      `,
       [donorId]
     );

     res.status(200).json(rows);
   } catch (error) {
     console.error("GET MY CONTRIBUTIONS ERROR:", error);
     res.status(500).json({ message: "Server error" });
   }
 };

 /**
  * --------------------------------------------------
  * PUBLIC → Leaderboard
  * (Rank donors by total contributed quantity)
  * --------------------------------------------------
  */
 export const getLeaderboard = async (_req: Request, res: Response) => {
   try {
     const [rows] = await db.query(
       `
      SELECT 
        u.id AS donor_id,
        u.name AS donor_name,
        COALESCE(SUM(c.quantity), 0) AS total_contributions
      FROM users u
      LEFT JOIN contributions c
        ON c.donor_id = u.id
      WHERE u.role = 'DONOR'
      GROUP BY u.id, u.name
      ORDER BY total_contributions DESC
      `
     );

     res.status(200).json(rows);
   } catch (error) {
     console.error("LEADERBOARD ERROR:", error);
     res.status(500).json({ message: "Server error" });
   }
 };