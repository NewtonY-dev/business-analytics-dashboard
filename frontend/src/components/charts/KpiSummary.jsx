const placeholderData = {
  totalSales: 1250,
  totalRevenue: 125000,
  totalQuantity: 3500,
  totalUsers: 85,
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value) => {
  return new Intl.NumberFormat("en-US").format(value);
};

export default function KpiSummary({ data, title = "Key Metrics" }) {
  const kpis = data || placeholderData;

  const cards = [
    {
      label: "Total Sales",
      value: formatNumber(kpis.totalSales),
      color: "#3b82f6",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(kpis.totalRevenue),
      color: "#10b981",
    },
    {
      label: "Total Quantity",
      value: formatNumber(kpis.totalQuantity),
      color: "#f59e0b",
    },
    {
      label: "Total Users",
      value: formatNumber(kpis.totalUsers),
      color: "#8b5cf6",
    },
  ];

  return (
    <div>
      <h3
        style={{ marginBottom: "1rem", fontSize: "1.1rem", fontWeight: "500" }}
      >
        {title}
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {cards.map((card) => (
          <div
            key={card.label}
            style={{
              backgroundColor: "#ffffff",
              padding: "1.25rem",
              borderRadius: "0.5rem",
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                marginBottom: "0.5rem",
              }}
            >
              {card.label}
            </div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: card.color,
              }}
            >
              {card.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
