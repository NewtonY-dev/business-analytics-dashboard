import pool from "../db/mysql.js";

export const listProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;
    const offset = (page - 1) * limit;

    let whereClauses = ["deleted_at IS NULL"];
    const params = [];

    if (search) {
      whereClauses.push("name LIKE ?");
      params.push(`%${search}%`);
    }
    if (category) {
      whereClauses.push("category = ?");
      params.push(category);
    }

    const whereSQL = whereClauses.length
      ? "WHERE " + whereClauses.join(" AND ")
      : "";

    // total count
    const [countRows] = await pool.execute(
      `SELECT COUNT(*) AS total FROM products ${whereSQL}`,
      params
    );
    const total = countRows[0].total;

    // paged results
    const [rows] = await pool.execute(
      `SELECT * FROM products ${whereSQL} ORDER BY created_at DESC LIMIT ?, ?`,
      [...params, Number(offset), Number(limit)]
    );

    res.json({
      success: true,
      page: Number(page),
      limit: Number(limit),
      total,
      results: rows,
    });
  } catch (err) {
    console.error("listProducts error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getProductById = async (req, res) => {};

export const createProduct = async (req, res) => {};

export const updateProduct = async (req, res) => {};

export const deleteProduct = async (req, res) => {};
