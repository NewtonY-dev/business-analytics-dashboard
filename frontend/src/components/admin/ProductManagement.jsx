import { useState, useEffect } from "react";
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/api";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listProducts({ limit: 100 });
      if (result.success) {
        setProducts(result.results || []);
      }
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);
    if (!formData.name?.trim()) {
      setError("Name is required");
      return;
    }
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      setError("Price must be a valid and non-negative number");
      return;
    }
    try {
      const data = {
        name: formData.name,
        category: formData.category || null,
        price: parseFloat(formData.price),
      };
      await createProduct(data);
      setFormData({ name: "", category: "", price: "" });
      await loadProducts();
    } catch (err) {
      setError(err.message || "Failed to create product");
    }
  };
  

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = {};
      if (formData.name) data.name = formData.name;
      if (formData.category !== undefined)
        data.category = formData.category || null;
      if (formData.price) data.price = parseFloat(formData.price);
      await updateProduct(editingId, data);
      setEditingId(null);
      setFormData({ name: "", category: "", price: "" });
      await loadProducts();
    } catch (err) {
      setError(err.message || "Failed to update product");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    setError(null);
    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (err) {
      setError(err.message || "Failed to delete product");
    }
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name || "",
      category: product.category || "",
      price: product.price || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", category: "", price: "" });
  };

  if (loading) {
    return <div style={{ padding: "2rem" }}>Loading products...</div>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Product Management</h2>
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
          {editingId ? "Edit Product" : "Create Product"}
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
            placeholder="Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required={!editingId}
            style={{ padding: "0.5rem", minWidth: "150px", flex: 1 }}
          />
          <input
            type="text"
            placeholder="Category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            style={{ padding: "0.5rem", minWidth: "150px", flex: 1 }}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Price *"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            required={!editingId}
            style={{ padding: "0.5rem", minWidth: "120px" }}
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
        <h3 style={{ marginBottom: "0.5rem" }}>Products ({products.length})</h3>
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
                  Name
                </th>
                <th
                  style={{
                    padding: "0.75rem",
                    textAlign: "left",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  Category
                </th>
                <th
                  style={{
                    padding: "0.75rem",
                    textAlign: "left",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  Price
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
              {products.map((p) => (
                <tr key={p.id}>
                  <td
                    style={{ padding: "0.75rem", border: "1px solid #e5e7eb" }}
                  >
                    {p.id}
                  </td>
                  <td
                    style={{ padding: "0.75rem", border: "1px solid #e5e7eb" }}
                  >
                    {p.name}
                  </td>
                  <td
                    style={{ padding: "0.75rem", border: "1px solid #e5e7eb" }}
                  >
                    {p.category || "-"}
                  </td>
                  <td
                    style={{ padding: "0.75rem", border: "1px solid #e5e7eb" }}
                  >
                    ${p.price}
                  </td>
                  <td
                    style={{ padding: "0.75rem", border: "1px solid #e5e7eb" }}
                  >
                    <button
                      onClick={() => startEdit(p)}
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
                      onClick={() => handleDelete(p.id)}
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
          {products.length === 0 && (
            <div
              style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}
            >
              No products found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
