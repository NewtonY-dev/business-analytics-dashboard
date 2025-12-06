import api from "../lib/api";

export async function listSales(params = {}) {
  try {
    const response = await api.get("/api/sales/listSales", { params });
    return response.data;
  } catch (error) {
    console.error("listSales error:", error);
    throw {
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to fetch sales",
      status: error?.response?.status,
    };
  }
}

export async function getSalesById(id) {
  try {
    const response = await api.get(`/api/sales/getSaleById/${id}`);
    return response.data;
  } catch (error) {
    console.error("getSalesById error:", error);
    throw {
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to fetch sale",
      status: error?.response?.status,
    };
  }
}

export async function listProducts(params = {}) {
  try {
    const response = await api.get("/api/products/listProducts", { params });
    return response.data;
  } catch (error) {
    console.error("listProducts error:", error);
    throw {
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to fetch products",
      status: error?.response?.status,
    };
  }
}

export async function getProductById(id) {
  try {
    const response = await api.get(`/api/products/getProductById/${id}`);
    return response.data;
  } catch (error) {
    console.error("getProductById error:", error);
    throw {
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to fetch product",
      status: error?.response?.status,
    };
  }
}

export async function getKpis(params = {}) {
  try {
    const response = await api.get("/api/analytics/kpis", { params });
    return response.data;
  } catch (error) {
    console.error("getKpis error:", error);
    throw {
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to fetch KPIs",
      status: error?.response?.status,
    };
  }
}

export async function getSalesByPeriod(params = {}) {
  try {
    const response = await api.get("/api/analytics/salesByPeriod", { params });
    return response.data;
  } catch (error) {
    console.error("getSalesByPeriod error:", error);
    throw {
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to fetch sales by period",
      status: error?.response?.status,
    };
  }
}

export async function getTopProducts(params = {}) {
  try {
    const response = await api.get("/api/analytics/topProducts", { params });
    return response.data;
  } catch (error) {
    console.error("getTopProducts error:", error);
    throw {
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to fetch top products",
      status: error?.response?.status,
    };
  }
}
