import { Request, Response } from "express";
import db from "../config/db";

// ------------------------------------
// DONOR → Schedule Pickup
// ------------------------------------
export const schedulePickup = async (
  req: Request & { user?: { id: number } },
  res: Response
) => {
  try {
    const donorId = req.user!.id;
    const { donation_id, pickup_date_time } = req.body;

    if (!donation_id || !pickup_date_time) {
      return res.status(400).json({ message: "Pickup date required" });
    }

    // ❌ Past date check
    if (new Date(pickup_date_time) < new Date()) {
      return res.status(400).json({
        message: "Pickup date cannot be in the past",
      });
    }

    // ❌ Conflict check
    const [existing]: any = await db.query(
      "SELECT id FROM pickups WHERE donation_id = ?",
      [donation_id]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Pickup already scheduled" });
    }

    // ✅ Schedule pickup
    await db.query(
      `INSERT INTO pickups (donation_id, donor_id, pickup_date_time)
       VALUES (?, ?, ?)`,
      [donation_id, donorId, pickup_date_time]
    );

    res.status(201).json({ message: "Pickup scheduled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Pickup scheduling failed" });
  }
};

// ------------------------------------
// DONOR → View My Pickups
// ------------------------------------
export const getMyPickups = async (
  req: Request & { user?: { id: number } },
  res: Response
) => {
  try {
    const donorId = req.user!.id;

    const [rows] = await db.query(
      `
      SELECT p.*, d.donation_type, d.location
      FROM pickups p
      JOIN donations d ON d.id = p.donation_id
      WHERE p.donor_id = ?
      ORDER BY p.created_at DESC
      `,
      [donorId]
    );

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pickups" });
  }
};
