import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root", // or your MySQL username if different
  password: "Jonesj,4421", // ✅ EXACT password
  database: "donation_portal",
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;
