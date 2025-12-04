// Expected data shape: { results: [{ productId: number, name: string, revenue: number, quantity: number }] }
// TODO: Replace placeholder data with API response from GET /analytics/topProducts

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const placeholderData = {
  results: [
    { productId: 1, name: "Product A", revenue: 4500, quantity: 120 },
    { productId: 2, name: "Product B", revenue: 3800, quantity: 95 },
    { productId: 3, name: "Product C", revenue: 3200, quantity: 80 },
    { productId: 4, name: "Product D", revenue: 2800, quantity: 70 },
    { productId: 5, name: "Product E", revenue: 2400, quantity: 60 },
  ],
};

export default function TopProductsChart({
  data,
  title = "Top Products",
  height = 300,
  metric = "revenue",
}) {
  const chartData = data?.results || placeholderData.results;
  const dataKey = metric === "quantity" ? "quantity" : "revenue";

  return (
    <div style={{ width: "100%", height }}>
      <h3
        style={{ marginBottom: "1rem", fontSize: "1.1rem", fontWeight: "500" }}
      >
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={height - 50}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
          <YAxis />
          <Tooltip />
          <Bar dataKey={dataKey} fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
