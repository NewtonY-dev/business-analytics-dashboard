import { useAuth } from "../contexts/AuthProvider";
import { useAnalyticsData } from "../hooks/useAnalyticsData";
import KpiSummary from "../components/charts/KpiSummary";
import SalesTrendChart from "../components/charts/SalesTrendChart";
import TopProductsChart from "../components/charts/TopProductsChart";

export default function Dashboard() {
  const { user } = useAuth();
  const { kpiData, salesData, productsData, loading, error, refresh } =
    useAnalyticsData();

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Loading analytics data...</p>
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
          onClick={refresh}
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
      <header>
        <h1>Dashboard</h1>
        <div>
          <p>Signed in as</p>
          <strong>
            <span>{user ? user.email || user.userId : "Guest"}</span>
          </strong>
        </div>
      </header>

      <main>
        <section>
          <h2>Shared analytics</h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            <KpiSummary data={kpiData} title="Key Metrics" />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                gap: "2rem",
              }}
            >
              <SalesTrendChart
                data={salesData}
                title="Sales Trend"
                height={300}
              />
              <TopProductsChart
                data={productsData}
                title="Top Products"
                height={300}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
