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

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      "SELECT * FROM products WHERE id = ? AND deleted_at IS NULL",
      [Number(id)]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("getProductById error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, category, price } = req.body;

    if (!name || price === undefined || price === null) {
      return res
        .status(400)
        .json({ success: false, message: "name and price are required" });
    }

    const parsedPrice = parseFloat(price);
    if (Number.isNaN(parsedPrice)) {
      return res
        .status(400)
        .json({ success: false, message: "price must be a number" });
    }

    const [result] = await pool.execute(
      "INSERT INTO products (name, category, price) VALUES (?, ?, ?)",
      [name, category || null, parsedPrice]
    );

    return res.status(201).json({
      success: true,
      message: "Product created",
      data: {
        id: result.insertId,
        name,
        category: category || null,
        price: parsedPrice,
      },
    });
  } catch (err) {
    console.error("createProduct error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price } = req.body;

    const productId = Number(id);
    if (!productId || Number.isNaN(productId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product id" });
    }

    const fields = [];
    const params = [];

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim() === "") {
        return res
          .status(400)
          .json({ success: false, message: "name must be a non-empty string" });
      }
      fields.push("name = ?");
      params.push(name.trim());
    }

    if (category !== undefined) {
      if (category === null) {
        fields.push("category = ?");
        params.push(null);
      } else if (typeof category === "string") {
        fields.push("category = ?");
        params.push(category.trim() || null);
      } else {
        return res.status(400).json({
          success: false,
          message: "category must be a string or null",
        });
      }
    }

    if (price !== undefined) {
      const parsedPrice = Number(price);
      if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({
          success: false,
          message: "price must be a non-negative number",
        });
      }
      fields.push("price = ?");
      params.push(parsedPrice);
    }

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided to update",
      });
    }

    const sql = `UPDATE products SET ${fields.join(
      ", "
    )} WHERE id = ? AND deleted_at IS NULL`;
    params.push(productId);

    const [result] = await pool.execute(sql, params);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found or already deleted",
      });
    }

    const [rows] = await pool.execute(
      "SELECT * FROM products WHERE id = ? AND deleted_at IS NULL",
      [productId]
    );
    return res
      .status(200)
      .json({ success: true, message: "Product updated", data: rows[0] });
  } catch (err) {
    console.error("updateProduct error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteProduct = async (req, res) => {};
