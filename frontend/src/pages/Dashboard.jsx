import { useState } from "react";
import KPIsPage from "./KPIsPage";
import SalesTrendPage from "./SalesTrendPage";
import TopProductsPage from "./TopProductsPage";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("kpis");

  const tabs = [
    { id: "kpis", label: "KPI", component: <KPIsPage /> },
    { id: "sales-trend", label: "Sales Trend", component: <SalesTrendPage /> },
    {
      id: "top-products",
      label: "Top Products",
      component: <TopProductsPage />,
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1.5rem",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setActiveTab(tab.id);
              }
            }}
            aria-pressed={activeTab === tab.id}
            aria-label={`Switch to ${tab.label} view`}
            style={{
              padding: "0.75rem 1.5rem",
              border: "none",
              borderBottom:
                activeTab === tab.id
                  ? "2px solid #3b82f6"
                  : "2px solid transparent",
              backgroundColor: "transparent",
              color: activeTab === tab.id ? "#3b82f6" : "#6b7280",
              fontWeight: activeTab === tab.id ? "600" : "400",
              cursor: "pointer",
              fontSize: "0.95rem",
              transition: "all 0.2s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            style={{ display: activeTab === tab.id ? "block" : "none" }}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
          >
            {tab.component}
          </div>
        ))}
      </div>
    </div>
  );
}
