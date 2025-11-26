import express from "express";
import dotenv from "dotenv";
import pool from "./db/mysql.js";
import authRouter from "./routes/auth.js";
import protectedRouter from "./routes/protected.js";

dotenv.config();
const app = express();
app.use(express.json()); // body parser

const PORT = process.env.PORT || 5000;

// routes
app.use("/api/auth", authRouter);
app.use("/api/protected", protectedRouter);

app.get("/", (req, res) => {
  res.send("bzn-anl-dsh Backend is running.");
});

(async () => {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log("MySQL connected");
  } catch (err) {
    console.error("MySQL connection failed:", err.message);
  }
})();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
