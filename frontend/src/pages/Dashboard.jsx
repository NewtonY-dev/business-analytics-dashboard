import { useAuth } from "../contexts/AuthProvider";
import { Link } from "react-router-dom";
import KpiSummary from "../components/charts/KpiSummary";
import SalesTrendChart from "../components/charts/SalesTrendChart";
import TopProductsChart from "../components/charts/TopProductsChart";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div>
      <header>
        <h1>Dashboard</h1>
        <div>
          <span>{user ? user.email || user.userId : "Guest"}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <main>
        <section>
          <h2>Shared analytics</h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            <KpiSummary data={null} title="Key Metrics" />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                gap: "2rem",
              }}
            >
              <SalesTrendChart data={null} title="Sales Trend" height={300} />
              <TopProductsChart data={null} title="Top Products" height={300} />
            </div>
          </div>
        </section>

        {user && user.role === "admin" && (
          <section>
            <h2>Admin management</h2>
            <Link to="/admin">Open Admin Panel</Link>
          </section>
        )}
      </main>
    </div>
  );
}
