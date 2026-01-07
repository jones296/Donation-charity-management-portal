import { Request, Response } from "express";
import pool from "../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* =========================
   REGISTER
========================= */
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Check if email already exists
    const [existing]: any = await pool.query(
      "SELECT id, is_active FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      if (existing[0].is_active === 1) {
        return res.status(409).json({
          message: "Account already exists with this email",
        });
      } else {
        return res.status(409).json({
          message:
            "This account was disabled. Please contact support or use another email.",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (name, email, password, role, is_active)
       VALUES (?, ?, ?, ?, 1)`,
      [name, email, hashedPassword, role]
    );

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("❌ Register error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   LOGIN
========================= */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const [rows]: any = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    // 🚫 Block inactive users
    if (user.is_active === 0) {
      return res.status(403).json({
        message: "Account is disabled. Please create a new account.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   FORGOT PASSWORD
   (SOFT DELETE)
========================= */
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const [rows]: any = await pool.query(
      "SELECT id FROM users WHERE email = ? AND is_active = 1",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "No active account found with this email",
      });
    }

    // ✅ Soft delete (disable account)
    await pool.query("UPDATE users SET is_active = 0 WHERE email = ?", [email]);

    return res.status(200).json({
      message:
        "Account disabled successfully. Please create a new account to continue.",
    });
  } catch (error) {
    console.error("❌ Forgot password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   ADMIN → REACTIVATE USER
   (DEMO / EXTRA CREDIT)
========================= */
export const adminReactivateUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const [result]: any = await pool.query(
      "UPDATE users SET is_active = 1 WHERE email = ?",
      [email]
    );

    if (result.affectedRows === 0) {
      return res.status(404);
    }

    return res.json({
      message: "User reactivated successfully",
    });
  } catch (error) {
    console.error("❌ Admin reactivate error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
