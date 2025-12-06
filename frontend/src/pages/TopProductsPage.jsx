import { useState, useEffect, useCallback } from "react";
import { getTopProducts } from "../services/api";
import TopProductsChart from "../components/charts/TopProductsChart";

export default function TopProductsPage() {
  const [productsData, setProductsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({
    from: "",
    to: "",
    limit: 5,
    sort: "revenue",
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const query = {
        from: params.from || undefined,
        to: params.to || undefined,
        limit: Number(params.limit) || 5,
        sort: params.sort || "revenue",
      };
      const data = await getTopProducts(query);
      if (data.success) setProductsData(data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to fetch top products"
      );
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset everything to initial state on retry
  const handleRetry = useCallback(() => {
    setParams({ from: "", to: "", limit: 5, sort: "revenue" });
    setProductsData(null);
    setError(null);
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Loading top products...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem" }}>
        <div style={{ color: "#ef4444", marginBottom: "1rem" }}>
          Error: {error}
        </div>
        <button
          onClick={handleRetry}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "0.375rem",
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          marginBottom: "1rem",
          padding: "0.75rem",
          backgroundColor: "#f9fafb",
          borderRadius: "8px",
        }}
      >
        <label
          style={{
            display: "block",
            fontSize: "0.85rem",
            marginBottom: "0.5rem",
            fontWeight: 600,
          }}
        >
          Filter Options
        </label>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <input
            type="date"
            value={params.from}
            onChange={(e) => setParams((p) => ({ ...p, from: e.target.value }))}
            style={{ padding: "0.4rem", minWidth: "140px" }}
          />
          <input
            type="date"
            value={params.to}
            onChange={(e) => setParams((p) => ({ ...p, to: e.target.value }))}
            style={{ padding: "0.4rem", minWidth: "140px" }}
          />
          <input
            type="number"
            min="1"
            max="50"
            value={params.limit}
            onChange={(e) =>
              setParams((p) => ({ ...p, limit: Number(e.target.value) }))
            }
            style={{ padding: "0.4rem", minWidth: "100px" }}
            placeholder="Limit"
          />
          <select
            value={params.sort}
            onChange={(e) => setParams((p) => ({ ...p, sort: e.target.value }))}
            style={{ padding: "0.4rem", minWidth: "140px" }}
          >
            <option value="revenue">Revenue</option>
            <option value="quantity">Quantity</option>
          </select>
        </div>
      </div>
      <TopProductsChart
        data={productsData}
        title="Top Products"
        height={400}
        metric={params.sort === "quantity" ? "quantity" : "revenue"}
      />
    </div>
  );
}
