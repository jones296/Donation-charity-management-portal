import { Request, Response } from "express";
import db from "../config/db";

/**
 * Extend Express Request to include user (from JWT middleware)
 */
interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

/**
 * --------------------------------------------------
 * DONOR → Confirm contribution
 * --------------------------------------------------
 */
export const createContribution = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const donorId = req.user.id;
    const { donation_id } = req.body;

    if (!donation_id) {
      return res.status(400).json({ message: "Donation ID is required" });
    }

    // Assign donor and mark donation as CONFIRMED
    const [result]: any = await db.query(
      `
      UPDATE donations 
      SET donor_id = ?, status = 'CONFIRMED'
      WHERE id = ? AND donor_id IS NULL
      `,
      [donorId, donation_id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(400)
        .json({ message: "Donation already confirmed or invalid ID" });
    }

    res.status(201).json({ message: "Contribution confirmed successfully" });
  } catch (error) {
    console.error("CREATE CONTRIBUTION ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * --------------------------------------------------
 * DONOR → View my contributions
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
      SELECT *
      FROM donations
      WHERE donor_id = ?
      ORDER BY created_at DESC
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
 * PUBLIC → Leaderboard (Top donors)
 * --------------------------------------------------
 */
export const getLeaderboard = async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        u.name,
        COUNT(d.id) AS total_contributions
      FROM users u
      JOIN donations d ON d.donor_id = u.id
      GROUP BY u.id
      ORDER BY total_contributions DESC
      LIMIT 10
      `
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("LEADERBOARD ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
