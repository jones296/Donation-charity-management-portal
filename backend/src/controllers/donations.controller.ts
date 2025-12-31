import { Request, Response } from "express";
import pool from "../config/db";

// NGO → Create donation request
export const createDonation = async (req: Request, res: Response) => {
  const {
    ngo_id,
    donation_type,
    quantity_or_amount,
    location,
    pickup_date_time,
    priority,
  } = req.body;

  try {
    await pool.query(
      `INSERT INTO donations 
      (ngo_id, donation_type, quantity_or_amount, location, pickup_date_time, priority, status)
      VALUES (?, ?, ?, ?, ?, ?, 'PENDING')`,
      [
        ngo_id,
        donation_type,
        quantity_or_amount,
        location,
        pickup_date_time,
        priority,
      ]
    );

    res.status(201).json({ message: "Donation request created" });
  } catch (err) {
    res.status(500).json({ message: "Failed to create donation" });
  }
};

// Donor → Browse donations
export const getAllDonations = async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM donations WHERE status='PENDING'"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch donations" });
  }
};
