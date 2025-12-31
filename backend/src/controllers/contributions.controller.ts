import { Request, Response } from "express";
import pool from "../config/db";

/**
 * POST /api/contributions
 * Donor creates a contribution
 */
export const createContribution = async (req: Request, res: Response) => {
  try {
    const { donor_id, donation_id, quantity_or_amount, notes } = req.body;

    if (!donor_id || !donation_id || !quantity_or_amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [result]: any = await pool.query(
      `INSERT INTO contributions 
       (donor_id, donation_id, quantity, notes, status)
       VALUES (?, ?, ?, ?, 'PENDING')`,
      [donor_id, donation_id, quantity_or_amount, notes || null]
    );

    res.status(201).json({
      message: "Contribution created successfully",
      contributionId: result.insertId,
    });
  } catch (error) {
    console.error("Create Contribution Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/contributions/donor/:donorId
 * Donor contribution history
 */
export const getDonorContributions = async (req: Request, res: Response) => {
  try {
    const { donorId } = req.params;

    const [rows] = await pool.query(
      `SELECT c.*, d.donation_type, d.location
       FROM contributions c
       JOIN donations d ON c.donation_id = d.id
       WHERE c.donor_id = ?
       ORDER BY c.created_at DESC`,
      [donorId]
    );

    res.json(rows);
  } catch (error) {
    console.error("Get Donor Contributions Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /api/contributions/ngo/:ngoId
 * NGO sees incoming contributions
 */
export const getNgoContributions = async (req: Request, res: Response) => {
  try {
    const { ngoId } = req.params;

    const [rows] = await pool.query(
      `SELECT c.*, u.name AS donor_name, d.donation_type
       FROM contributions c
       JOIN donations d ON c.donation_id = d.id
       JOIN users u ON c.donor_id = u.id
       WHERE d.ngo_id = ?
       ORDER BY c.created_at DESC`,
      [ngoId]
    );

    res.json(rows);
  } catch (error) {
    console.error("Get NGO Contributions Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
