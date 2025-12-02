import { Link } from "react-router-dom";
export default function AdminPanel() {
  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Admin-only management tools go here (products, sales, exports).</p>
      {/* product/sales management UI here */}

      <section>
        <h2>User Dashboard</h2>
        <Link to="/dashboard">Open User Dashboard</Link>
      </section>
    </div>
  );
}
