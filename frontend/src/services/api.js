import api from "../lib/api";

export async function getKpis(params = {}) {
  try {
    const response = await api.get("/api/analytics/kpis", { params });
    return response.data;
  } catch (error) {
    console.error("getKpis error:", error);
    throw error;
  }
}

export async function getSalesByPeriod(params = {}) {
  try {
    const response = await api.get("/api/analytics/salesByPeriod", { params });
    return response.data;
  } catch (error) {
    console.error("getSalesByPeriod error:", error);
    throw error;
  }
}

export async function getTopProducts(params = {}) {
  try {
    const response = await api.get("/api/analytics/topProducts", { params });
    return response.data;
  } catch (error) {
    console.error("getTopProducts error:", error);
    throw error;
  }
}
