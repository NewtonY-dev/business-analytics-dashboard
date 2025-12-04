import { useAuth } from "../../contexts/AuthProvider";
import "./dashboardLayout.css";

function NavItem({ label, isActive = false, onClick }) {
  const className = isActive
    ? "dashboard-nav-item dashboard-nav-item--active"
    : "dashboard-nav-item";

  return (
    <div className={className} onClick={onClick}>
      {label}
    </div>
  );
}

export function DashboardLayout({ children, title = "Dashboard" }) {
  const auth = useAuth() || {};
  const user = auth.user;
  const logout =
    typeof auth.logout === "function"
      ? auth.logout
      : () => console.warn("AuthProvider logout not available");

  const isAdmin = user?.role === "admin";

  return (
    <div className="dashboard-root">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">Business Analytics</div>

        <div>
          <div className="dashboard-nav-section-title">Main</div>
          <div className="dashboard-nav-group">
            {/* TODO: Wire this to router's dashboard route (e.g., /dashboard) */}
            <NavItem label="Overview" isActive />
            {/* TODO: Replace with real navigation items for all authenticated users */}
            <NavItem label="Sales" />
            <NavItem label="Products" />
          </div>
        </div>

        {isAdmin && (
          <div>
            <div className="dashboard-nav-section-title">Admin</div>
            <div className="dashboard-nav-group">
              {/* TODO: Replace with real admin-only navigation items (e.g., /admin/analytics, /admin/users) */}
              <NavItem label="Admin Analytics" />
              <NavItem label="Management" />
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
            {/* TODO: Add small global actions or filters here if needed later */}
            {new Date().toLocaleDateString()}
          </div>
        </header>

        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;
