import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrders, updateOrderStatusBackend } from "../features/ordersSlice";
import { useNavigate } from "react-router-dom";

export default function Dashboard({
  STATUS_COLORS = {},
  onNavigateToOrders, // Optional prop agar aap parent se navigation handle kar rahe hain
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.products.items);
  const orders = useSelector((state) => state.orders.items);
  const [searchOrder, setSearchOrder] = useState("");

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Total Revenue: Matches strictly with the updated backend variable 'orderStatus'
  const totalRevenue = orders
    .filter((o) => (o.orderStatus || o.status) === "Delivered")
    .reduce((s, o) => s + (Number(o.price) || 0), 0);

  // Active Orders Count: Tracking using 'orderStatus' key
  const activeOrdersCount = orders.filter(
    (o) =>
      (o.orderStatus || o.status) === "Pending" ||
      (o.orderStatus || o.status) === "Processing",
  ).length;

  // Filter and Search mechanism safely targeting id and name fields
  const filteredOrders = orders.filter((o) => {
    const currentId = o.id || "";
    return (
      (o.name?.toLowerCase() || "").includes(searchOrder.toLowerCase()) ||
      currentId.toLowerCase().includes(searchOrder.toLowerCase())
    );
  });

  // FIXED: Sirf top 3 recent orders nikalne ke liye slice kiya
  const displayedOrders = filteredOrders.slice(0, 3);

  // Handle View More Click (Agar react-router-dom use kar rahe hain to window.location ya useNavigate use karein)
  const handleViewMore = () => {
    navigate("/orders");
  };

  return (
    <>
      <div className="stats-row">
        <div className="stat-card c1">
          <div>
            <div className="stat-label">Total Products</div>
            <div className="stat-val">{products.length}</div>
            <div className="stat-sub">
              {products.filter((p) => p.status === "Active").length} active ·{" "}
              {products.filter((p) => p.status === "Out of Stock").length} out
              of stock
            </div>
          </div>
          <div className="stat-icon-box c1">📦</div>
        </div>
        <div className="stat-card c2">
          <div>
            <div className="stat-label">Active Orders</div>
            <div className="stat-val">{activeOrdersCount}</div>
            <div className="stat-sub">
              {
                orders.filter((o) => (o.orderStatus || o.status) === "Pending")
                  .length
              }{" "}
              pending ·{" "}
              {
                orders.filter(
                  (o) => (o.orderStatus || o.status) === "Processing",
                ).length
              }{" "}
              processing
            </div>
          </div>
          <div className="stat-icon-box c2">📋</div>
        </div>
        <div className="stat-card c3">
          <div>
            <div className="stat-label">Earnings</div>
            <div className="stat-val">Rs. {totalRevenue}</div>
            <div className="stat-sub">
              {
                orders.filter(
                  (o) => (o.orderStatus || o.status) === "Delivered",
                ).length
              }{" "}
              orders delivered
            </div>
          </div>
          <div className="stat-icon-box c3">💰</div>
        </div>
      </div>

      {/* Table Section */}
      <div className="table-card">
        <div className="table-header">
          <div>
            <h3>Recent Orders</h3>
            <p>Latest customer orders across all cities</p>
          </div>
          <input
            className="search-box"
            placeholder="🔍 Search orders..."
            value={searchOrder}
            onChange={(e) => setSearchOrder(e.target.value)}
          />
        </div>
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>City</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {displayedOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "var(--muted)",
                    }}
                  >
                    No recent entries found matching criteria.
                  </td>
                </tr>
              ) : (
                displayedOrders.map((o) => {
                  const currentStatus = o.orderStatus || "Pending";
                  const sc = STATUS_COLORS[currentStatus] || {};
                  return (
                    <tr key={o._id || o.id}>
                      <td>{o.id}</td>
                      <td>{o.name}</td>
                      <td>{o.city}</td>
                      <td>Rs. {o.price}</td>
                      <td>
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
                          style={{ color: sc.color, fontWeight: 600 }}
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
                      <td style={{ color: "var(--muted)", fontSize: 12 }}>
                        {o.createdAt || "N/A"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* FIXED: "View More" Button added below the table */}
        {filteredOrders.length > 3 && (
          <div style={{ textAlign: "center", padding: "16px 0 8px 0" }}>
            <button
              className="act-btn act-view"
              onClick={handleViewMore}
              style={{
                padding: "8px 24px",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              View More Orders →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
