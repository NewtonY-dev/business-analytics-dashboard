import pool from "../db/mysql.js";

export const getKpis = async (req, res) => {
  try {
    const { from, to } = req.query;

    const now = new Date();
    const defaultFrom = new Date(now);
    defaultFrom.setDate(defaultFrom.getDate() - 30);

    const parseDate = (s) => {
      if (!s) return null;
      const d = new Date(s);
      return Number.isNaN(d.getTime()) ? null : d;
    };

    const fromDate = parseDate(from) || defaultFrom;
    const toDateInput = parseDate(to) || now;
    if (fromDate.getTime() > toDateInput.getTime()) {
      return res.status(400).json({
        success: false,
        message: "Invalid date range: from must be <= to",
      });
    }

    // use exclusive upper bound: toDate + 1 day
    const toExclusive = new Date(toDateInput);
    toExclusive.setDate(toExclusive.getDate() + 1);

    const sql = `
      SELECT
        COUNT(*) AS totalSales,
        COALESCE(SUM(amount * qty), 0) AS totalRevenue,
        COALESCE(SUM(qty), 0) AS totalQuantity,
        COUNT(DISTINCT user_id) AS totalUsers
      FROM sales
      WHERE deleted_at IS NULL
        AND created_at >= ?
        AND created_at < ?
    `;
    const params = [
      fromDate.toISOString().slice(0, 19).replace("T", " "),
      toExclusive.toISOString().slice(0, 19).replace("T", " "),
    ];

    const [rows] = await pool.execute(sql, params);
    const result = rows[0] || {
      totalSales: 0,
      totalRevenue: 0,
      totalQuantity: 0,
      totalUsers: 0,
    };

    return res.status(200).json({
      success: true,
      totalSales: Number(result.totalSales || 0),
      totalRevenue: Number(result.totalRevenue || 0),
      totalQuantity: Number(result.totalQuantity || 0),
      totalUsers: Number(result.totalUsers || 0),
    });
  } catch (err) {
    console.error("getKpis error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getSalesByPeriod = async (req, res) => {};

export const getTopProducts = async (req, res) => {};
