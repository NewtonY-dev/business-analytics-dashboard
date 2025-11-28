import pool from "../db/mysql.js";

export const listSales = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      startDate,
      endDate,
      product_id,
      user_id,
    } = req.query;
    const offset = (page - 1) * limit;

    let whereClauses = ["deleted_at IS NULL"];
    const params = [];

    if (search) {
      whereClauses.push("transaction_id LIKE ?");
      params.push(`%${search}%`);
    }
    if (product_id) {
      whereClauses.push("product_id = ?");
      params.push(product_id);
    }
    if (user_id) {
      whereClauses.push("user_id = ?");
      params.push(user_id);
    }
    if (startDate) {
      whereClauses.push("created_at >= ?");
      params.push(startDate);
    }
    if (endDate) {
      whereClauses.push("created_at < ?");
      params.push(endDate);
    }

    const whereSQL = whereClauses.length
      ? "WHERE " + whereClauses.join(" AND ")
      : "";

    // total count
    const [countRows] = await pool.execute(
      `SELECT COUNT(*) AS total FROM sales ${whereSQL}`,
      params
    );
    const total = countRows[0].total;

    // paged results
    const [rows] = await pool.execute(
      `SELECT * FROM sales ${whereSQL} ORDER BY created_at DESC LIMIT ?, ?`,
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
    console.error("listSales error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      "SELECT * FROM sales WHERE id = ? AND deleted_at IS NULL",
      [Number(id)]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Sale not found" });
    }
    return res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("getSaleById error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createSale = async (req, res) => {
  try {
    const { transaction_id, user_id, product_id, amount, qty } = req.body;

    if (amount === undefined || amount === null) {
      return res
        .status(400)
        .json({ success: false, message: "amount is required" });
    }

    const parsedAmount = parseFloat(amount);
    if (Number.isNaN(parsedAmount)) {
      return res
        .status(400)
        .json({ success: false, message: "amount must be a number" });
    }

    const parsedQty = qty !== undefined && qty !== null ? parseInt(qty, 10) : 1;
    if (Number.isNaN(parsedQty) || parsedQty <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "qty must be a positive integer" });
    }

    const [result] = await pool.execute(
      "INSERT INTO sales (transaction_id, user_id, product_id, amount, qty) VALUES (?, ?, ?, ?, ?)",
      [
        transaction_id || null,
        user_id !== undefined && user_id !== null ? Number(user_id) : null,
        product_id !== undefined && product_id !== null
          ? Number(product_id)
          : null,
        parsedAmount,
        parsedQty,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Sale created",
      data: {
        id: result.insertId,
        transaction_id: transaction_id || null,
        user_id:
          user_id !== undefined && user_id !== null ? Number(user_id) : null,
        product_id:
          product_id !== undefined && product_id !== null
            ? Number(product_id)
            : null,
        amount: parsedAmount,
        qty: parsedQty,
      },
    });
  } catch (err) {
    console.error("createSale error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const { transaction_id, user_id, product_id, amount, qty } = req.body;

    const saleId = Number(id);
    if (!saleId || Number.isNaN(saleId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid sale id" });
    }

    const fields = [];
    const params = [];

    if (transaction_id !== undefined) {
      if (transaction_id === null) {
        fields.push("transaction_id = ?");
        params.push(null);
      } else if (typeof transaction_id === "string") {
        fields.push("transaction_id = ?");
        params.push(transaction_id.trim() || null);
      } else {
        return res.status(400).json({
          success: false,
          message: "transaction_id must be a string or null",
        });
      }
    }

    if (user_id !== undefined) {
      if (user_id === null) {
        fields.push("user_id = ?");
        params.push(null);
      } else {
        const parsedUser = Number(user_id);
        if (Number.isNaN(parsedUser) || parsedUser <= 0) {
          return res.status(400).json({
            success: false,
            message: "user_id must be a positive integer or null",
          });
        }
        fields.push("user_id = ?");
        params.push(parsedUser);
      }
    }

    if (product_id !== undefined) {
      if (product_id === null) {
        fields.push("product_id = ?");
        params.push(null);
      } else {
        const parsedProduct = Number(product_id);
        if (Number.isNaN(parsedProduct) || parsedProduct <= 0) {
          return res.status(400).json({
            success: false,
            message: "product_id must be a positive integer or null",
          });
        }
        fields.push("product_id = ?");
        params.push(parsedProduct);
      }
    }

    if (amount !== undefined) {
      const parsedAmount = Number(amount);
      if (Number.isNaN(parsedAmount) || parsedAmount < 0) {
        return res.status(400).json({
          success: false,
          message: "amount must be a non-negative number",
        });
      }
      fields.push("amount = ?");
      params.push(parsedAmount);
    }

    if (qty !== undefined) {
      const parsedQty = Number(qty);
      if (
        Number.isNaN(parsedQty) ||
        !Number.isInteger(parsedQty) ||
        parsedQty <= 0
      ) {
        return res
          .status(400)
          .json({ success: false, message: "qty must be a positive integer" });
      }
      fields.push("qty = ?");
      params.push(parsedQty);
    }

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided to update",
      });
    }

    const sql = `UPDATE sales SET ${fields.join(
      ", "
    )} WHERE id = ? AND deleted_at IS NULL`;
    params.push(saleId);

    const [result] = await pool.execute(sql, params);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Sale not found or already deleted" });
    }

    const [rows] = await pool.execute(
      "SELECT * FROM sales WHERE id = ? AND deleted_at IS NULL",
      [saleId]
    );
    return res
      .status(200)
      .json({ success: true, message: "Sale updated", data: rows[0] });
  } catch (err) {
    console.error("updateSale error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteSale = async (req, res) => {};

export const exportSalesJson = async (req, res) => {};
