import { useAuth } from "../../contexts/AuthProvider";
import "./dashboardLayout.css";
import { Link, useLocation } from "react-router-dom";

function NavItem({ label, isActive = false }) {
  const className = isActive
    ? "dashboard-nav-item dashboard-nav-item--active"
    : "dashboard-nav-item";

  return <div className={className}>{label}</div>;
}

export function DashboardLayout({ children, title = "Dashboard" }) {
  const auth = useAuth() || {};
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  const user = auth.user;
  const logout =
    typeof auth.logout === "function"
      ? auth.logout
      : () => console.log("AuthProvider logout not available");

  const isAdmin = user?.role === "admin";

  return (
    <div className="dashboard-root">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">Business Analytics</div>

        <div>
          <div className="dashboard-nav-section-title">Main</div>
          <div className="dashboard-nav-group">
            <Link to="/dashboard">
              <NavItem
                label="Overview"
                isActive={location.pathname === "/dashboard"}
              />
            </Link>
            <Link to="/dashboard/kpis">
              <NavItem
                label="KPIs"
                isActive={location.pathname === "/dashboard/kpis"}
              />
            </Link>
            <Link to="/dashboard/sales-trend">
              <NavItem
                label="Sales Trend"
                isActive={location.pathname === "/dashboard/sales-trend"}
              />
            </Link>
            <Link to="/dashboard/top-products">
              <NavItem
                label="Top Products"
                isActive={location.pathname === "/dashboard/top-products"}
              />
            </Link>
          </div>
        </div>

        {isAdmin && (
          <div>
            <div className="dashboard-nav-section-title">Admin</div>
            <div className="dashboard-nav-group">
              {isAdminPage ? (
                <Link to="/dashboard">
                  <NavItem label="Dashboard" />
                </Link>
              ) : (
                <Link to="/admin">
                  <NavItem label="Admin Panel" />
                </Link>
              )}
            </div>
          </div>
        )}

        <div className="dashboard-user-box">
          <div>
            Signed in as <strong>{user?.email || "Unknown User"}</strong>
          </div>
          <div>Role: {user?.role || "unknown"}</div>
          <button
            type="button"
            className="dashboard-logout-button"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="dashboard-header-title">{title}</div>
          <div className="dashboard-header-right">
            {new Date().toLocaleDateString()}
          </div>
        </header>

        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
