import { useState } from "react";
import ProductManagement from "../components/admin/ProductManagement";
import SaleManagement from "../components/admin/SaleManagement";
import ExportButton from "../components/admin/ExportButton";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("products");

  const tabs = [
    { id: "products", label: "Products", component: <ProductManagement /> },
    { id: "sales", label: "Sales", component: <SaleManagement /> },
    { id: "export", label: "Export Sales", component: <ExportButton /> },

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
