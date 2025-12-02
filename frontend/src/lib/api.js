import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/',
  headers: { "Content-Type": "application/json" },
});

let logoutCallback = null;

export function setLogoutCallback(callback) {
  logoutCallback = callback;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("authToken");
      delete api.defaults.headers.common["Authorization"];
      
      if (logoutCallback) {
        logoutCallback();
      }
      
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export function setAuthHeader(token) {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
}

export default api;