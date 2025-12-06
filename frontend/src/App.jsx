import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import KPIsPage from "./pages/KPIsPage";
import SalesTrendPage from "./pages/SalesTrendPage";
import TopProductsPage from "./pages/TopProductsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/kpis"
        element={
          <ProtectedRoute>
            <DashboardLayout title="KPIs">
              <KPIsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/sales-trend"
        element={
          <ProtectedRoute>
            <DashboardLayout title="Sales Trend">
              <SalesTrendPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/top-products"
        element={
          <ProtectedRoute>
            <DashboardLayout title="Top Products">
              <TopProductsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminPanel />
          </AdminRoute>
        }
      />

      <Route path="*" element={<Login />} />
    </Routes>
  );
}
