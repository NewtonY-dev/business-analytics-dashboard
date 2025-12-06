/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import api, { setLogoutCallback } from "../lib/api";

const STORAGE_KEY = "authToken";

export const AuthContext = createContext(null);

function parseJwt(token) {
  try {
    if (typeof token !== "string") {
      return null;
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isValidToken(parsed) {
  if (!parsed) return false;
  if (!parsed.userId && !parsed.id) return false;
  if (!parsed.email) return false;
  if (!parsed.role) return false;

  if (!parsed.exp) return false;
  if (Date.now() / 1000 >= parsed.exp) return false;

  return true;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setAuthToken = useCallback((t) => {
    if (t) {
      const parsed = parseJwt(t);
      if (!isValidToken(parsed)) {
        console.error("Invalid token provided");
        return;
      }

      localStorage.setItem(STORAGE_KEY, t);
      api.defaults.headers.common["Authorization"] = `Bearer ${t}`;
      setToken(t);
      setUser({
        ...parsed,
        id: parsed.userId || parsed.id,
      });
    } else {
      localStorage.removeItem(STORAGE_KEY);
      delete api.defaults.headers.common["Authorization"];
      setToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    setLogoutCallback(() => setAuthToken(null));

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = parseJwt(saved);
      if (isValidToken(parsed)) {
        api.defaults.headers.common["Authorization"] = `Bearer ${saved}`;
        setToken(saved);
        setUser({
          ...parsed,
          id: parsed.userId || parsed.id,
        });
      } else {
        setAuthToken(null);
      }
    }
    setLoading(false);
  }, [setAuthToken]);

  const login = useCallback(
    async (credentials) => {
      try {
        const res = await api.post("/api/auth/login", credentials);
        const t = res.data?.token;
        if (!t) throw new Error("No token returned");
        setAuthToken(t);

        return { success: true };
      } catch (err) {
        const message =
          err?.response?.data?.message || err.message || "Login failed";
        return { success: false, message };
      }
    },
    [setAuthToken]
  );

  const signup = useCallback(
    async (data) => {
      try {
        const res = await api.post("/api/auth/signup", data);
        if (res.data?.token) {
          setAuthToken(res.data.token);
          return { success: true };
        }
        const loginRes = await login({
          email: data.email,
          password: data.password,
        });
        return loginRes;
      } catch (err) {
        const message =
          err?.response?.data?.message || err.message || "Signup failed";
        return { success: false, message };
      }
    },
    [login, setAuthToken]
  );

  const logout = useCallback(() => {
    setAuthToken(null);
  }, [setAuthToken]);

  const isAuthenticated = useCallback(() => Boolean(token), [token]);

  const authorizeRole = useCallback(
    (role) => {
      return Boolean(user && user.role === role);
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        signup,
        isAuthenticated,
        authorizeRole,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
