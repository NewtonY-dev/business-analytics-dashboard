import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

export default function Signup() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await auth.signup({ name, email, password });
    setLoading(false);
    if (res.success) {
      navigate("/dashboard", { replace: true });
    } else {
      setError(res.message || "Signup failed");
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Sign up</h2>
      {error && <div>{error}</div>}
      <div>
        <label>Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Signing up..." : "Sign up"}
      </button>
      <div>
        <Link to="/login">Log in to account</Link>
      </div>
    </form>
  );
}
