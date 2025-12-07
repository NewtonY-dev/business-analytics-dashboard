import { useState, useEffect } from "react";
import {
  listSales,
  createSale,
  updateSale,
  deleteSale,
} from "../../services/api";

export default function SaleManagement() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    transaction_id: "",
    user_id: "",
    product_id: "",
    amount: "",
    qty: "",
  });

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listSales({ limit: 100 });
      if (result.success) {
        setSales(result.results || []);
      }
    } catch (err) {
      setError(err.message || "Failed to load sales");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);
    if (!formData.amount || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <0) {
      setError("Amount must be a valid number");
      return;
    }
    try {
      const data = {
        transaction_id: formData.transaction_id || null,
        user_id: formData.user_id ? parseInt(formData.user_id) : null,
        product_id: formData.product_id ? parseInt(formData.product_id) : null,
        amount: parseFloat(formData.amount),
        qty: formData.qty ? parseInt(formData.qty) : 1,
      };
      await createSale(data);
      setFormData({
        transaction_id: "",
        user_id: "",
        product_id: "",
        amount: "",
        qty: "",
      });
      await loadSales();
    } catch (err) {
      setError(err.message || "Failed to create sale");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = {};
      if (formData.transaction_id !== undefined)
        data.transaction_id = formData.transaction_id || null;
      if (formData.user_id !== undefined)
        data.user_id = formData.user_id ? parseInt(formData.user_id) : null;
      if (formData.product_id !== undefined)
        data.product_id = formData.product_id
          ? parseInt(formData.product_id)
          : null;
      if (formData.amount) data.amount = parseFloat(formData.amount);
      if (formData.qty) data.qty = parseInt(formData.qty);
      await updateSale(editingId, data);
      setEditingId(null);
      setFormData({
        transaction_id: "",
        user_id: "",
        product_id: "",
        amount: "",
        qty: "",
      });
      await loadSales();
    } catch (err) {
      setError(err.message || "Failed to update sale");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this sale?")) return;
    setError(null);
    try {
      await deleteSale(id);
      await loadSales();
    } catch (err) {
      setError(err.message || "Failed to delete sale");
    }
  };

  const startEdit = (sale) => {
    setEditingId(sale.id);
    setFormData({
      transaction_id: sale.transaction_id || "",
      user_id: sale.user_id || "",
      product_id: sale.product_id || "",
      amount: sale.amount || "",
      qty: sale.qty || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      transaction_id: "",
      user_id: "",
      product_id: "",
      amount: "",
      qty: "",
    });
  };

  if (loading) {
    return <div style={{ padding: "2rem" }}>Loading sales...</div>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Sale Management</h2>
      {error && (
        <div
          style={{
            color: "#ef4444",
            marginBottom: "1rem",
            padding: "0.5rem",
            backgroundColor: "#fee2e2",
            borderRadius: "4px",
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={editingId ? handleUpdate : handleCreate}
        style={{
          marginBottom: "2rem",
          padding: "1rem",
          backgroundColor: "#f9fafb",
          borderRadius: "8px",
        }}
      >
        <h3 style={{ marginBottom: "0.5rem" }}>
          {editingId ? "Edit Sale" : "Create Sale"}
        </h3>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            marginBottom: "0.5rem",
          }}
        >
          <input
            type="text"
            placeholder="Transaction ID"
            value={formData.transaction_id}
            onChange={(e) =>
              setFormData({ ...formData, transaction_id: e.target.value })
            }
            style={{ padding: "0.5rem", minWidth: "150px", flex: 1 }}
          />
          <input
            type="number"
            placeholder="User ID"
            value={formData.user_id}
            onChange={(e) =>
              setFormData({ ...formData, user_id: e.target.value })
            }
            style={{ padding: "0.5rem", minWidth: "120px" }}
          />
          <input
            type="number"
            placeholder="Product ID"
            value={formData.product_id}
            onChange={(e) =>
              setFormData({ ...formData, product_id: e.target.value })
            }
            style={{ padding: "0.5rem", minWidth: "120px" }}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Amount *"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            required={!editingId}
            style={{ padding: "0.5rem", minWidth: "120px" }}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={formData.qty}
            onChange={(e) => setFormData({ ...formData, qty: e.target.value })}
            style={{ padding: "0.5rem", minWidth: "100px" }}
          />
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            type="submit"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {editingId ? "Update" : "Create"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#6b7280",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div>
        <h3 style={{ marginBottom: "0.5rem" }}>Sales ({sales.length})</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f3f4f6" }}>
                <th
                  style={{
                    padding: "0.75rem",
                    textAlign: "left",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  ID
                </th>
                <th
                  style={{
                    padding: "0.75rem",
                    textAlign: "left",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  Transaction ID
                </th>
                <th
                  style={{
                    padding: "0.75rem",
                    textAlign: "left",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  User ID
                </th>
                <th
                  style={{
                    padding: "0.75rem",
                    textAlign: "left",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  Product ID
                </th>
                <th
                  style={{
                    padding: "0.75rem",
                    textAlign: "left",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  Amount
                </th>
                <th
                  style={{
                    padding: "0.75rem",
                    textAlign: "left",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  Qty
                </th>
                <th
                  style={{
                    padding: "0.75rem",
                    textAlign: "left",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s.id}>
                  <td
                    style={{ padding: "0.75rem", border: "1px solid #e5e7eb" }}
                  >
                    {s.id}
                  </td>
                  <td
                    style={{ padding: "0.75rem", border: "1px solid #e5e7eb" }}
                  >
                    {s.transaction_id || "-"}
                  </td>
                  <td
                    style={{ padding: "0.75rem", border: "1px solid #e5e7eb" }}
                  >
                    {s.user_id || "-"}
                  </td>
                  <td
                    style={{ padding: "0.75rem", border: "1px solid #e5e7eb" }}
                  >
                    {s.product_id || "-"}
                  </td>
                  <td
                    style={{ padding: "0.75rem", border: "1px solid #e5e7eb" }}
                  >
                    ${s.amount}
                  </td>
                  <td
                    style={{ padding: "0.75rem", border: "1px solid #e5e7eb" }}
                  >
                    {s.qty}
                  </td>
                  <td
                    style={{ padding: "0.75rem", border: "1px solid #e5e7eb" }}
                  >
                    <button
                      onClick={() => startEdit(s)}
                      style={{
                        padding: "0.25rem 0.5rem",
                        marginRight: "0.5rem",
                        backgroundColor: "#10b981",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      style={{
                        padding: "0.25rem 0.5rem",
                        backgroundColor: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sales.length === 0 && (
            <div
              style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}
            >
              No sales found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
