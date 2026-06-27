import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

export default function SideBar({ onLogout }) {
  const products = useSelector((state) => state.products.items);
  const orders = useSelector((state) => state.orders.items);

  const activeOrdersCount = orders.filter(
    (o) => o.orderStatus === "Pending" || o.orderStatus === "Processing",
  ).length;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon-box">🫖</div>
        <div>
          <div className="logo-name">FFKITCHEN</div>
          <div className="logo-sub">Admin Panel</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-label">Main Menu</div>

        <NavLink
          to="/dashboard"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          end
          style={{ textDecoration: "none" }}
        >
          <span className="nav-icon">▦</span> Dashboard
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          style={{ textDecoration: "none" }}
        >
          <span className="nav-icon">🏺</span> Products
          <span className="nav-badge">{products.length}</span>
        </NavLink>

        <div className="nav-label" style={{ marginTop: 20 }}>
          Orders
        </div>

        <NavLink
          to="/orders"
          className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          style={{ textDecoration: "none" }}
        >
          <span className="nav-icon">📦</span> All Orders
          <span className="nav-badge">{orders.length}</span>
        </NavLink>

        {/* <div
          className="nav-item"
          style={{ opacity: 0.4, cursor: "not-allowed" }}
        >
          <span className="nav-icon">📊</span> Analytics
        </div> */}
      </nav>

      <div className="sidebar-footer">
        <div
          className="logout-btn"
          onClick={onLogout}
          style={{ cursor: "pointer" }}
        >
          <span style={{ fontSize: 16 }}>⇠</span> Logout
        </div>
      </div>
    </aside>
  );
}
