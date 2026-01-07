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
 * NGO → Create Donation Request
 * --------------------------------------------------
 */
export const createDonation = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== "NGO") {
      return res
        .status(403)
        .json({ message: "Only NGOs can create donations" });
    }

    const ngoId = req.user.id;
    const { donation_type, quantity_or_amount, location, pickup_date_time } =
      req.body;

    if (
      !donation_type ||
      !quantity_or_amount ||
      !location ||
      !pickup_date_time
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (quantity_or_amount <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be greater than zero" });
    }

    const pickupDate = new Date(pickup_date_time);
    const now = new Date();

    if (pickupDate <= now) {
      return res
        .status(400)
        .json({ message: "Pickup date must be in the future" });
    }

    await db.query(
      `
      INSERT INTO donations
      (
        ngo_id,
        donation_type,
        quantity_or_amount,
        remaining_quantity,
        location,
        pickup_date_time,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, 'PENDING')
      `,
      [
        ngoId,
        donation_type,
        quantity_or_amount,
        quantity_or_amount,
        location,
        pickup_date_time,
      ]
    );

    return res.status(201).json({
      message: "Donation request created",
    });
  } catch (error) {
    console.error("CREATE DONATION ERROR:", error);
    return res.status(500).json({
      message: "Failed to create donation request",
    });
  }
};

/**
 * --------------------------------------------------
 * PUBLIC → View All Active Donation Requests
 * (Donor page — expired hidden)
 * --------------------------------------------------
 */
export const getAllDonations = async (_req: Request, res: Response) => {
  try {
    const [rows] = await db.query(
      `
      SELECT *
      FROM donations
      WHERE remaining_quantity > 0
        AND pickup_date_time > NOW()
        AND status IN ('PENDING', 'CONFIRMED')
      ORDER BY created_at DESC
      `
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("GET DONATIONS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch donations" });
  }
};

/**
 * --------------------------------------------------
 * NGO → View My Donation Requests
 * (Shows EXPIRED rows)
 * --------------------------------------------------
 */
export const getNgoDonations = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== "NGO") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const ngoId = req.user.id;

    const [rows] = await db.query(
      `
      SELECT
        id,
        ngo_id,
        donation_type,
        quantity_or_amount,
        remaining_quantity,
        location,
        pickup_date_time,
        created_at,
        CASE
          WHEN pickup_date_time < NOW()
               AND status = 'PENDING'
               AND remaining_quantity = quantity_or_amount
          THEN 'EXPIRED'
          ELSE status
        END AS status
      FROM donations
      WHERE ngo_id = ?
      ORDER BY pickup_date_time DESC
      `,
      [ngoId]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("GET NGO DONATIONS ERROR:", error);
    res.status(500).json({ message: "Failed to fetch NGO donations" });
  }
};

/**
 * --------------------------------------------------
 * NGO → Mark Donation as COMPLETED
 * --------------------------------------------------
 */
export const markDonationCompleted = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user || req.user.role !== "NGO") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    const [result]: any = await db.query(
      `
      UPDATE donations
      SET status = 'COMPLETED'
      WHERE id = ?
        AND remaining_quantity = 0
        AND status = 'CONFIRMED'
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({
        message: "Donation not eligible for completion",
      });
    }

    res.json({ message: "Donation marked as COMPLETED" });
  } catch (error) {
    console.error("MARK COMPLETED ERROR:", error);
    res.status(500).json({ message: "Failed to update donation status" });
  }
};

/**
 * --------------------------------------------------
 * SYSTEM → Mark Expired Donations (CRON JOB)
 * --------------------------------------------------
 */
export const markExpiredDonations = async () => {
  try {
    const [result]: any = await db.query(
      `
      UPDATE donations
      SET status = 'EXPIRED'
      WHERE pickup_date_time < NOW()
        AND status = 'PENDING'
        AND remaining_quantity = quantity_or_amount
      `
    );

    console.log(`⏰ Marked ${result.affectedRows} donations as EXPIRED`);
  } catch (error) {
    console.error("❌ EXPIRE ERROR:", error);
  }
};
