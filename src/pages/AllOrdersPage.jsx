import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
// Backend thunk action call karne ke liye import kiya
import { fetchOrders, updateOrderStatusBackend } from "../features/ordersSlice";

export default function AllOrdersPage({
  STATUS_COLORS = {},
  modal,
  setModal,
  selectedOrder,
  setSelectedOrder,
}) {
  const dispatch = useDispatch();

  // Redux store se orders data aur loading state nikali
  const { items: orders, loading } = useSelector((state) => state.orders);

  const [searchOrder, setSearchOrder] = useState("");
  const [cityFilter, setCityFilter] = useState("All Cities");

  // Page load hote hi orders fetch karne ke liye useEffect
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Cities filter ke liye unique cities list banayi
  const uniqueCities = [
    "All Cities",
    ...new Set(orders.map((o) => o.city || "")),
  ];

  // Search aur City ke mutabik data filter ho rha hai (_id database format ke sath)
  const filteredOrders = orders.filter((o) => {
    const currentId = o._id || "";
    const matchesSearch =
      (o.name?.toLowerCase() || "").includes(searchOrder.toLowerCase()) ||
      currentId.toLowerCase().includes(searchOrder.toLowerCase());
    const matchesCity = cityFilter === "All Cities" || o.city === cityFilter;
    return matchesSearch && matchesCity;
  });

  return (
    <div className="table-card">
      <div className="table-header">
        <div>
          <h3>All Customer Orders</h3>
          <p>
            Showing {filteredOrders.length} of {orders.length} operational
            pipeline logs
          </p>
        </div>
        <div className="table-actions">
          <select
            className="status-sel"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            {uniqueCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <input
            className="search-box"
            placeholder="🔍 Search name or ID..."
            value={searchOrder}
            onChange={(e) => setSearchOrder(e.target.value)}
          />
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Address</th>
              <th>Items</th>
              <th>Total</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    textAlign: "center",
                    padding: "24px",
                    color: "var(--muted)",
                  }}
                >
                  Loading operational logs...
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    textAlign: "center",
                    color: "var(--muted)",
                    padding: "24px",
                  }}
                >
                  No historical entries found matching target conditions.
                </td>
              </tr>
            ) : (
              filteredOrders.map((o) => {
                // Aapki requirement ke mutabik keys ko '_id' aur 'orderStatus' par set kiya hai
                const currentStatus = o.orderStatus || "Pending";
                const sc = STATUS_COLORS[currentStatus] || {};

                return (
                  <tr key={o._id}>
                    <td className="order-id">{o.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{o.name}</div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>
                        {o.contactPhone}
                      </div>
                    </td>
                    <td style={{ color: "var(--muted)", fontSize: 12 }}>
                      {o.address}
                    </td>
                    <td style={{ color: "var(--muted)" }}>
                      {o.productName} item{o.items > 1 ? "s" : ""}
                    </td>
                    <td style={{ fontWeight: 600, color: "var(--text)" }}>
                      Rs. {o.price}
                    </td>
                    <td style={{ color: "var(--muted)", fontSize: 12 }}>
                      {o.createdAt}
                    </td>
                    <td>
                      {/* FIXED: 'value' me strict 'o.orderStatus' use kiya aur dispatch me '_id' bheja */}
                      <select
                        className="status-sel"
                        value={currentStatus}
                        onChange={(e) =>
                          dispatch(
                            updateOrderStatusBackend({
                              id: o._id,
                              status: e.target.value,
                            }),
                          )
                        }
                        style={{ color: sc.color }}
                      >
                        {[
                          "Pending",
                          "Processing",
                          "Delivered",
                          "Cancelled",
                        ].map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className="action-group">
                        <button
                          className="act-btn act-view"
                          onClick={() => {
                            setSelectedOrder(o);
                            setModal("order");
                          }}
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ==================== DIALOG MODAL MARKUP ==================== */}
      <div className={`modal-overlay ${modal === "order" ? "open" : ""}`}>
        {selectedOrder && (
          <div className="modal-box">
            <div className="modal-head">
              <div>
                <h3>Order Log Details</h3>
                <p>System review pipeline for target payload entry</p>
              </div>
              <button className="modal-close" onClick={() => setModal("")}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="od-grid">
                <div className="od-field">
                  <label>Order ID</label>
                  <span className="order-id" style={{ fontWeight: 600 }}>
                    {selectedOrder.id}
                  </span>
                </div>
                <div className="od-field">
                  <label>Product</label>
                  <span>{selectedOrder.productName}</span>
                </div>
              </div>

              <div className="od-grid">
                <div className="od-field">
                  <label>Customer Name</label>
                  <span style={{ fontWeight: 600 }}>{selectedOrder.name}</span>
                </div>
                <div className="od-field">
                  <label>Contact Number</label>
                  <span>{selectedOrder.contactPhone}</span>
                </div>
              </div>

              <div className="od-grid">
                <div className="od-field">
                  <label>Target Delivery City</label>
                  <span>{selectedOrder.city}</span>
                </div>
                <div className="od-field">
                  <label>Price</label>
                  <span
                    style={{
                      color:
                        STATUS_COLORS[selectedOrder.orderStatus || "Pending"]
                          ?.color,
                      fontWeight: 600,
                    }}
                  >
                    Rs. {selectedOrder.price}
                  </span>
                </div>
              </div>

              <div className="od-field" style={{ marginBottom: "20px" }}>
                <label>Address</label>
                <span style={{ display: "block", marginTop: "4px" }}>
                  <strong>{selectedOrder.address?.toLocaleString()}</strong>
                </span>
              </div>

              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setModal("")}>
                  Close Log Review
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
