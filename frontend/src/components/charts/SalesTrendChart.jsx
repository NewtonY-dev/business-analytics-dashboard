import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const placeholderData = {
  results: [
    { label: "2024-01-01", value: 1200 },
    { label: "2024-01-02", value: 1900 },
    { label: "2024-01-03", value: 3000 },
    { label: "2024-01-04", value: 2780 },
    { label: "2024-01-05", value: 1890 },
    { label: "2024-01-06", value: 2390 },
    { label: "2024-01-07", value: 3490 },
  ],
};

export default function SalesTrendChart({
  data,
  title = "Sales Trend",
  height = 300,
}) {
  const chartData = data?.results || placeholderData.results;

  return (
    <div style={{ width: "100%", height }}>
      <h3
        style={{ marginBottom: "1rem", fontSize: "1.1rem", fontWeight: "500" }}
      >
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={height - 50}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
