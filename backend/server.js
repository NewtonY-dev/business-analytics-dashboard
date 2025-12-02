import express from "express";
import dotenv from "dotenv";
import cors from "cors"; 
import pool from "./db/mysql.js";
import authRouter from "./routes/auth.js";
import protectedRouter from "./routes/protected.js";
import productsRouter from "./routes/productRoutes.js"; 
import salesRouter from "./routes/salesRoutes.js";
import analyticsRouter from "./routes/analyticsRoutes.js";

dotenv.config();
const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // Vite default port
  credentials: true
}));
app.use(express.json()); // body parser

const PORT = process.env.PORT || 5000;

// routes
app.use("/api/auth", authRouter);
app.use("/api/protected", protectedRouter);
app.use("/api/products", productsRouter); 
app.use("/api/sales", salesRouter); 
app.use("/api/analytics", analyticsRouter);

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
