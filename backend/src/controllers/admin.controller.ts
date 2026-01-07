import { Request, Response } from "express";
import pool from "../config/db";

// -------------------------
// ADMIN → View Disabled Users
// -------------------------
export const getDisabledUsers = async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, email, role FROM users WHERE is_active = 0"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// -------------------------
// ADMIN → Reactivate User
// -------------------------
export const reactivateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    await pool.query("UPDATE users SET is_active = 1 WHERE id = ?", [userId]);

    res.json({ message: "User reactivated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to reactivate user" });
  }
};
