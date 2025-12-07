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

export async function createProduct(data) {
  try {
    const response = await api.post("/api/products/createProduct", data);
    return response.data;
  } catch (error) {
    console.error("createProduct error:", error);
    throw {
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to create product",
      status: error?.response?.status,
    };
  }
}

export async function updateProduct(id, data) {
  try {
    const response = await api.put(`/api/products/updateProduct/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("updateProduct error:", error);
    throw {
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to update product",
      status: error?.response?.status,
    };
  }
}

export async function deleteProduct(id) {
  try {
    const response = await api.delete(`/api/products/deleteProduct/${id}`);
    return response.data;
  } catch (error) {
    console.error("deleteProduct error:", error);
    throw {
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to delete product",
      status: error?.response?.status,
    };
  }
}

export async function createSale(data) {
  try {
    const response = await api.post("/api/sales/createSale", data);
    return response.data;
  } catch (error) {
    console.error("createSale error:", error);
    throw {
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to create sale",
      status: error?.response?.status,
    };
  }
}

export async function updateSale(id, data) {
  try {
    const response = await api.put(`/api/sales/updateSale/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("updateSale error:", error);
    throw {
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to update sale",
      status: error?.response?.status,
    };
  }
}

export async function deleteSale(id) {
  try {
    const response = await api.delete(`/api/sales/deleteSale/${id}`);
    return response.data;
  } catch (error) {
    console.error("deleteSale error:", error);
    throw {
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to delete sale",
      status: error?.response?.status,
    };
  }
}

export async function exportSales(params = {}) {
  try {
    const response = await api.get("/api/sales/exportSales", { params });
    return response.data;
  } catch (error) {
    console.error("exportSales error:", error);
    throw {
      message:
        error?.response?.data?.message ||
        error.message ||
        "Failed to export sales",
      status: error?.response?.status,
    };
  }
}
