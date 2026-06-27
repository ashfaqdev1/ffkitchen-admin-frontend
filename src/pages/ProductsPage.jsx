import React, { useState } from "react";
import { useSelector } from "react-redux";

export default function ProductsPage({
  STATUS_COLORS,
  emptyProduct,
  setEditData,
  setEditId,
  setModal,
}) {
  const products = useSelector((state) => state.products.items);
  const [searchProd, setSearchProd] = useState("");
  const backendBaseUrl = "http://localhost:5000";

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchProd.toLowerCase()) ||
      p.category.toLowerCase().includes(searchProd.toLowerCase()),
  );

  return (
    <div className="table-card">
      <div className="table-header">
        <div>
          <h3>All Products</h3>
          <p>
            {filteredProducts.length} of {products.length} products
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            className="search-box"
            placeholder="🔍 Search products..."
            value={searchProd}
            onChange={(e) => setSearchProd(e.target.value)}
          />
          <button
            className="add-btn"
            onClick={() => {
              setEditData({ ...emptyProduct, imageUrl: "", imageFile: null });
              setModal("add");
            }}
          >
            + Add Product
          </button>
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => {
              const sc = STATUS_COLORS[p.status] || {};
              return (
                <tr key={p.id}>
                  <td>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      {/* 🚀 RENDER IMAGES FROM THE EXPRESS SERVER */}
                      <div
                        className="product-emoji-cell"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "6px",
                          overflow: "hidden",
                          background: "#f5f5f5",
                        }}
                      >
                        {p.imageUrl ? (
                          <img
                            src={
                              p.imageUrl.startsWith("http")
                                ? p.imageUrl
                                : `${backendBaseUrl}${p.imageUrl}`
                            }
                            alt={p.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.target.src =
                                "https://placehold.co/50x50?text=🍽️";
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              height: "100%",
                              fontSize: "18px",
                            }}
                          >
                            🍽️
                          </div>
                        )}
                      </div>

                      <div>
                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: "var(--muted)" }}>
                          ID #{p.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: "var(--muted)", fontSize: 12 }}>
                    {p.category}
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    Rs. {p.price.toLocaleString()}
                  </td>
                  <td>
                    <span
                      style={{
                        color:
                          p.stock === 0
                            ? "var(--red)"
                            : p.stock < 5
                              ? "var(--yellow)"
                              : "var(--text)",
                      }}
                    >
                      {p.stock === 0 ? "0" : p.stock}
                    </span>
                  </td>
                  <td>
                    <span
                      className="status-badge"
                      style={{
                        // background: sc.bg + "33",
                        color: sc.color,
                        // border: `1px solid ${sc.color}44`,
                      }}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <div
                      className="action-group"
                      style={{ display: "flex", gap: 6 }}
                    >
                      <button
                        className="act-btn act-edit"
                        onClick={() => {
                          setEditData({
                            name: p.name,
                            category: p.category,
                            price: p.price,
                            stock: p.stock,
                            status: p.status,
                            imageUrl: p.imageUrl, // 🚀 Sync key matching
                            desc: p.desc || "",
                            imageFile: null,
                          });
                          setEditId(p.id);
                          setModal("edit");
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="act-btn act-del"
                        onClick={() => {
                          setEditId(p.id);
                          setModal("delete");
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
