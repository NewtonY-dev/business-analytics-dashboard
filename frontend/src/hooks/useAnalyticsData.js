import { useState, useEffect, useCallback } from "react";
import { getKpis, getSalesByPeriod, getTopProducts } from "../services/api";

export function useAnalyticsData() {
  const [kpiData, setKpiData] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [productsData, setProductsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [kpis, sales, products] = await Promise.all([
        getKpis(),
        getSalesByPeriod(),
        getTopProducts(),
      ]);

      if (kpis.success) setKpiData(kpis);
      if (sales.success) setSalesData(sales);
      if (products.success) setProductsData(products);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to fetch analytics data"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { kpiData, salesData, productsData, loading, error, refresh };
}
