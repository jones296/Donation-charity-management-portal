import { Request, Response } from "express";
import db from "../config/db";

/**
 * --------------------------------------------------
 * DONOR → Schedule Pickup (FULL DATE VALIDATION)
 * --------------------------------------------------
 */
export const schedulePickup = async (
  req: Request & { user?: { id: number } },
  res: Response
) => {
  try {
    const donorId = req.user!.id;
    const { donation_id, pickup_date_time } = req.body;

    if (!donation_id || !pickup_date_time) {
      return res.status(400).json({ message: "Pickup date is required" });
    }

    const pickupDate = new Date(pickup_date_time);
    const now = new Date();

    // ❌ Past / current time
    if (pickupDate <= now) {
      return res.status(400).json({
        message: "Pickup date & time must be in the future",
      });
    }

    // 1️⃣ Get NGO pickup date
    const [donationRows]: any = await db.query(
      `
      SELECT pickup_date_time
      FROM donations
      WHERE id = ?
      `,
      [donation_id]
    );

    if (donationRows.length === 0) {
      return res.status(404).json({ message: "Donation not found" });
    }

    const ngoPickupDate = new Date(donationRows[0].pickup_date_time);

    // ❌ Donor date after NGO date
    if (pickupDate > ngoPickupDate) {
      return res.status(400).json({
        message: "Pickup date must be on or before NGO pickup date",
      });
    }

    // 2️⃣ Prevent duplicate pickup
    const [existing]: any = await db.query(
      "SELECT id FROM pickups WHERE donation_id = ?",
      [donation_id]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Pickup already scheduled" });
    }

    // ✅ Schedule pickup
    await db.query(
      `
      INSERT INTO pickups (donation_id, donor_id, pickup_date_time)
      VALUES (?, ?, ?)
      `,
      [donation_id, donorId, pickup_date_time]
    );

    res.status(201).json({ message: "Pickup scheduled successfully" });
  } catch (error) {
    console.error("PICKUP ERROR:", error);
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
      SELECT 
        p.id,
        p.pickup_date_time,
        d.donation_type,
        d.location,
        d.status
      FROM pickups p
      JOIN donations d ON d.id = p.donation_id
      WHERE p.donor_id = ?
      ORDER BY p.pickup_date_time DESC
      `,
      [donorId]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("GET MY PICKUPS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch pickups" });
  }
};