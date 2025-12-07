// frontend/src/components/admin/ExportButton.jsx
import { useState } from "react";
import { exportSales } from "../../services/api";

export default function ExportButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noData, setNoData] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    startDate: "",
    endDate: "",
    product_id: "",
    user_id: "",
  });

  const handleExport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNoData(false);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.product_id) params.product_id = Number(filters.product_id);
      if (filters.user_id) params.user_id = Number(filters.user_id);
  
      const data = await exportSales(params);
      if (data.success) {
        if (!data.results || data.results.length === 0) {
          setNoData(true);
        } else {
          setNoData(false);
          const jsonStr = JSON.stringify(data.results, null, 2);
          const blob = new Blob([jsonStr], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `sales-export-${new Date().toISOString().split("T")[0]}.json`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      } else {
        setNoData(true);
      }
    } catch (err) {
      setError(err.message || "Failed to export sales");
      setNoData(false);
    } finally {
      setLoading(false);
      setFilters({
        search: "",
        startDate: "",
        endDate: "",
        product_id: "",
        user_id: "",
      });
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Export Sales</h2>
      {error && (
        <div
          style={{
            color: "#ef4444",
            marginBottom: "1rem",
            padding: "0.5rem",
            backgroundColor: "#fee2e2",
            borderRadius: "4px",
          }}
        >
          {error}
        </div>
      )}

{noData && (
  <div
    style={{
      color: "#f59e0b",
      marginBottom: "1rem",
      padding: "0.5rem",
      backgroundColor: "#fef3c7",
      borderRadius: "4px",
    }}
  >
    No data matches your filters
  </div>
)}

      <form
        onSubmit={handleExport}
        style={{
          marginBottom: "1rem",
          padding: "1rem",
          backgroundColor: "#f9fafb",
          borderRadius: "8px",
        }}
      >
        <h3 style={{ marginBottom: "0.5rem" }}>Filter Options</h3>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            marginBottom: "0.5rem",
          }}
        >
          <input
            type="text"
            placeholder="Search Transaction ID"
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
            style={{ padding: "0.5rem", minWidth: "150px", flex: 1 }}
          />
          <input
            type="date"
            placeholder="Start Date"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
            style={{ padding: "0.5rem", minWidth: "140px" }}
          />
          <input
            type="date"
            placeholder="End Date"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
            style={{ padding: "0.5rem", minWidth: "140px" }}
          />
          <input
            type="number"
            placeholder="Product ID"
            value={filters.product_id}
            onChange={(e) =>
              setFilters({ ...filters, product_id: e.target.value })
            }
            style={{ padding: "0.5rem", minWidth: "120px" }}
          />
          <input
            type="number"
            placeholder="User ID"
            value={filters.user_id}
            onChange={(e) =>
              setFilters({ ...filters, user_id: e.target.value })
            }
            style={{ padding: "0.5rem", minWidth: "120px" }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: loading ? "#9ca3af" : "#10b981",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Exporting..." : "Export Sales (JSON)"}
        </button>
      </form>
    </div>
  );
}