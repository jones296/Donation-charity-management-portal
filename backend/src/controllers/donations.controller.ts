import { Request, Response } from "express";
import pool from "../config/db";

// --------------------------------------------------
// GET all donations (PUBLIC)
// --------------------------------------------------
export const getAllDonations = async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT *
      FROM donations
      ORDER BY created_at DESC
    `);

    res.status(200).json(rows);
  } catch (error) {
    console.error("❌ Error fetching donations:", error);
    res.status(500).json({ message: "Failed to fetch donations" });
  }
};

// --------------------------------------------------
// CREATE donation (NGO ONLY)
// --------------------------------------------------
export const createDonation = async (
  req: Request & { user?: { id: number; role: string } },
  res: Response
) => {
  try {
    const { donation_type, quantity_or_amount, location, pickup_date_time } =
      req.body;

    if (
      !donation_type ||
      !quantity_or_amount ||
      !location ||
      !pickup_date_time
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const ngo_id = req.user!.id;

    await pool.query(
      `
      INSERT INTO donations
      (ngo_id, donation_type, quantity_or_amount, location, pickup_date_time, status)
      VALUES (?, ?, ?, ?, ?, 'PENDING')
      `,
      [ngo_id, donation_type, quantity_or_amount, location, pickup_date_time]
    );

    res.status(201).json({ message: "Donation created successfully" });
  } catch (error) {
    console.error("❌ Error creating donation:", error);
    res.status(500).json({ message: "Failed to create donation" });
  }
};

// --------------------------------------------------
// GET donations created by logged-in NGO
// --------------------------------------------------
export const getNgoDonations = async (
  req: Request & { user?: { id: number; role: string } },
  res: Response
) => {
  try {
    const ngoId = req.user!.id;

    const [rows] = await pool.query(
      `
      SELECT *
      FROM donations
      WHERE ngo_id = ?
      ORDER BY created_at DESC
      `,
      [ngoId]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("❌ Error fetching NGO donations:", error);
    res.status(500).json({ message: "Failed to fetch NGO donations" });
  }
};

// --------------------------------------------------
// MARK donation as COMPLETED (NGO ONLY)
// --------------------------------------------------
export const markDonationCompleted = async (
  req: Request & { user?: { id: number; role: string } },
  res: Response
) => {
  try {
    const donationId = req.params.id;
    const ngoId = req.user!.id;

    const [result]: any = await pool.query(
      `
      UPDATE donations
      SET status = 'COMPLETED'
      WHERE id = ?
        AND ngo_id = ?
        AND status = 'CONFIRMED'
      `,
      [donationId, ngoId]
    );

    // ✅ SAFETY CHECK (important)
    if (result.affectedRows === 0) {
      return res.status(400).json({
        message: "Donation not found or not in CONFIRMED state",
      });
    }

    res.status(200).json({ message: "Donation marked as COMPLETED" });
  } catch (error) {
    console.error("❌ Error marking donation completed:", error);
    res.status(500).json({ message: "Failed to update donation status" });
  }
};
