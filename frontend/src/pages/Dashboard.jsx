import { useAuth } from "../contexts/AuthProvider";
import { Link } from "react-router-dom";

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
          {/* fetch & show KPI cards here */}
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
