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

export const getSalesByPeriod = async (req, res) => {
  try {
    const { from, to, group = "day" } = req.query;
    const allowedGroups = ["day", "week", "month"];
    if (!allowedGroups.includes(group)) {
      return res.status(400).json({
        success: false,
        message: "Invalid group. Use day, week, or month.",
      });
    }

    const now = new Date();
    const fromDate = from
      ? new Date(from)
      : new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);
    const toDateRaw = to ? new Date(to) : now;
    if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDateRaw.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format for 'from' or 'to'.",
      });
    }
    if (fromDate.getTime() > toDateRaw.getTime()) {
      return res.status(400).json({
        success: false,
        message: "'from' must be before or equal to 'to'.",
      });
    }

    // enforce sensible max ranges
    const msPerDay = 24 * 60 * 60 * 1000;
    const rangeDays =
      Math.ceil((toDateRaw.getTime() - fromDate.getTime()) / msPerDay) + 1;
    if (group === "day" && rangeDays > 365) {
      return res.status(400).json({
        success: false,
        message: "Range too large for daily grouping (max 365 days).",
      });
    }
    if (group === "week" && rangeDays > 365 * 2) {
      return res.status(400).json({
        success: false,
        message: "Range too large for weekly grouping (max ~2 years).",
      });
    }
    if (group === "month" && rangeDays > 365 * 5) {
      return res.status(400).json({
        success: false,
        message: "Range too large for monthly grouping (max ~5 years).",
      });
    }

    // use exclusive upper bound: add one day to toDateRaw so "to" is inclusive by day
    const toDate = new Date(toDateRaw.getTime() + msPerDay);

    // choose date format for grouping
    let dateFormat;
    if (group === "day") dateFormat = "%Y-%m-%d";
    else if (group === "week") dateFormat = "%x-W%v";
    else dateFormat = "%Y-%m"; // month

    const fromParam = fromDate.toISOString().slice(0, 19).replace("T", " ");
    const toParam = toDate.toISOString().slice(0, 19).replace("T", " ");

    const sql = `
      SELECT DATE_FORMAT(created_at, ?) AS label, COALESCE(SUM(amount * qty), 0) AS revenue
      FROM sales
      WHERE deleted_at IS NULL
        AND created_at >= ?
        AND created_at < ?
      GROUP BY label
      ORDER BY label ASC
    `;

    const [rows] = await pool.execute(sql, [dateFormat, fromParam, toParam]);

    const results = rows.map((r) => ({
      label: r.label,
      value: Number(r.revenue),
    }));

    return res.json({ success: true, results });
  } catch (err) {
    console.error("getSalesByPeriod error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getTopProducts = async (req, res) => {
  try {
    const { from, to, limit = 10, sort = "revenue" } = req.query;

    const now = new Date();
    const defaultFrom = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);

    const parseDate = (s) => {
      if (!s) return null;
      const d = new Date(s);
      return Number.isNaN(d.getTime()) ? null : d;
    };

    const fromDate = parseDate(from) || defaultFrom;
    const toDateRaw = parseDate(to) || now;
    if (fromDate.getTime() > toDateRaw.getTime()) {
      return res
        .status(400)
        .json({ success: false, message: "'from' must be <= 'to'" });
    }

    const parsedLimit = Number(limit);
    if (
      !Number.isInteger(parsedLimit) ||
      parsedLimit <= 0 ||
      parsedLimit > 50
    ) {
      return res.status(400).json({
        success: false,
        message: "limit must be an integer between 1 and 50",
      });
    }

    const allowedSorts = ["revenue", "quantity"];
    if (!allowedSorts.includes(sort)) {
      return res.status(400).json({
        success: false,
        message: "sort must be 'revenue' or 'quantity'",
      });
    }

    const toExclusive = new Date(toDateRaw.getTime() + 24 * 60 * 60 * 1000);

    const fromParam = fromDate.toISOString().slice(0, 19).replace("T", " ");
    const toParam = toExclusive.toISOString().slice(0, 19).replace("T", " ");

    // safe mapping for ORDER BY (validated above)
    const orderBy = sort === "quantity" ? "quantity" : "revenue";

    const sql = `
      SELECT
        s.product_id AS productId,
        p.name AS name,
        COALESCE(SUM(s.amount * s.qty), 0) AS revenue,
        COALESCE(SUM(s.qty), 0) AS quantity
      FROM sales s
      JOIN products p ON s.product_id = p.id
      WHERE s.deleted_at IS NULL
        AND p.deleted_at IS NULL
        AND s.created_at >= ?
        AND s.created_at < ?
      GROUP BY s.product_id
      ORDER BY ${orderBy} DESC
      LIMIT ?
    `;

    const [rows] = await pool.execute(sql, [fromParam, toParam, parsedLimit]);

    const results = rows.map((r) => ({
      productId: Number(r.productId),
      name: r.name,
      revenue: Number(r.revenue),
      quantity: Number(r.quantity),
    }));

    return res.json({ success: true, results });
  } catch (err) {
    console.error("getTopProducts error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
