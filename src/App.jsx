import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// 🚀 UPDATED: Importing the Asynchronous Thunks connecting to your server API
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "./features/productsSlice";
import { fetchOrders, updateOrderStatusBackend } from "./features/ordersSlice";

// Core Workspace Visual Components
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import ModalManager from "./components/ModalManager";

// Page Context Target Switches
import Dashboard from "./pages/Dashboard";
import ProductsPage from "./pages/ProductsPage";
import AllOrdersPage from "./pages/AllOrdersPage";
import LoginPage from "./pages/LoginPage";

const CATS = [
  "Dinner Sets",
  "Tea Sets",
  "Glassware",
  "Mugs",
  "Bowls",
  "Serving",
  "Storage",
  "Bakeware",
  "Decor",
];
const EMOJIS = [
  "🍽️",
  "🫖",
  "🥂",
  "☕",
  "🥣",
  "🪨",
  "🧂",
  "🫙",
  "🫗",
  "🥘",
  "🍵",
  "🏺",
  "🍶",
  "🫕",
];
const STATUS_COLORS = {
  Pending: { bg: "#FFF3CD", color: "#856404" },
  Processing: { bg: "#CCE5FF", color: "#004085" },
  Delivered: { bg: "#D4EDDA", color: "#1c7431" },
  Cancelled: { bg: "#F8D7DA", color: "#721C24" },
  Active: { bg: "#D4EDDA", color: "#2b9e46" },
  "Out of Stock": { bg: "#F8D7DA", color: "#721C24" },
};

const emptyProduct = {
  name: "",
  category: "Dinner Sets",
  price: "",
  stock: "",
  status: "Active",
  image: "🍽️",
  desc: "",
};

function AdminAppManager() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Initialize authorization state by verifying if an authentication token exists in storage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("token");
  });

  // Subscribing to live data models and server status states directly out of Redux
  const { items: products, loading: productsLoading } = useSelector(
    (state) => state.products,
  );
  const { items: orders } = useSelector((state) => state.orders);

  // Layout UI states
  const [modal, setModal] = useState(null);
  const [editData, setEditData] = useState(emptyProduct);
  const [editId, setEditId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 🚀 FETCH PRODUCTS FROM LIVE SERVER ON COMPONENT MOUNT OR AUTH CHANGE
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProducts());
      // If orders slice setup has an async thunk runner, fetch them here too:
      // dispatch(fetchOrders());
    }
  }, [dispatch, isAuthenticated]);

  // ─── UPDATED ASYNC HANDLER: CREATE / UPDATE PRODUCTS ───────────────────
  const handleSaveProduct = () => {
    if (!editData.name || !editData.price || editData.stock === "") {
      showToast("Fill all required fields", "error");
      return;
    }

    if (modal === "add") {
      dispatch(addProduct(editData))
        .unwrap()
        .then(() => {
          showToast("Product created on server successfully!");
          setModal(null);
          setEditData(emptyProduct);
          setEditId(null);
        })
        .catch((err) => {
          showToast(err || "Failed to create product on backend.", "error");
        });
    } else if (modal === "edit" && editId) {
      dispatch(updateProduct({ id: editId, updatedData: editData }))
        .unwrap()
        .then(() => {
          showToast("Product modifications saved to database!");
          setModal(null);
          setEditData(emptyProduct);
          setEditId(null);
        })
        .catch((err) => {
          showToast(err || "Failed to save product variations.", "error");
        });
    }
  };

  // ─── UPDATED ASYNC HANDLER: DELETE PRODUCT ─────────────────────────────
  const handleDelete = () => {
    if (!editId) return;

    dispatch(deleteProduct(editId))
      .unwrap()
      .then(() => {
        showToast("Product permanently removed from inventory.", "success");
        setModal(null);
        setEditId(null);
      })
      .catch((err) => {
        showToast(err || "Server rejected item deletion query.", "error");
      });
  };

  const handleStatusUpdate = (id, status) => {
    dispatch(updateOrderStatus({ id, status }));
    showToast(`Order status updated to ${status}`);
  };

  const handleLogoutTrigger = () => {
    setModal("logout");
  };

  // Clear session storage context markers cleanly upon user approval
  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setModal(null);
    navigate("/", { replace: true });
    showToast("Session terminated securely.", "error");
  };

  return (
    <>
      <Routes>
        {/* ROOT LOGIN PATHWAY CONTROL ROUTE */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage
                onLoginSuccess={() => {
                  setIsAuthenticated(true);
                  showToast("Welcome to FFKITCHEN Admin Terminal!");
                  navigate("/dashboard", { replace: true });
                }}
              />
            )
          }
        />

        {/* SECURE PROTECTED ROUTING SHELL */}
        <Route
          element={
            isAuthenticated ? (
              <div className="layout">
                <SideBar onLogout={handleLogoutTrigger} />
                <div className="main">
                  <Header onLogout={handleLogoutTrigger} />
                  <div className="content">
                    {productsLoading && (
                      <div
                        className="confirm-center"
                        style={{ padding: "20px", color: "var(--gold)" }}
                      >
                        🔄 Refreshing secure FFKITCHEN ledger assets...
                      </div>
                    )}
                    <Outlet />
                  </div>
                </div>
              </div>
            ) : (
              <Navigate to="/" replace />
            )
          }
        >
          <Route
            path="/dashboard"
            element={
              <Dashboard
                STATUS_COLORS={STATUS_COLORS}
                updateOrderStatus={handleStatusUpdate}
                setSelectedOrder={setSelectedOrder}
                setModal={setModal}
              />
            }
          />
          <Route
            path="/products"
            element={
              <ProductsPage
                STATUS_COLORS={STATUS_COLORS}
                emptyProduct={emptyProduct}
                setEditData={setEditData}
                setEditId={setEditId}
                setModal={setModal}
              />
            }
          />
          <Route
            path="/orders"
            element={
              <AllOrdersPage
                STATUS_COLORS={STATUS_COLORS}
                updateOrderStatus={handleStatusUpdate}
                modal={modal}
                selectedOrder={selectedOrder}
                setSelectedOrder={setSelectedOrder}
                setModal={setModal}
              />
            }
          />
        </Route>

        {/* CATCH-ALL REDIRECT FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ModalManager
        modal={modal}
        setModal={setModal}
        editData={editData}
        setEditData={setEditData}
        editId={editId}
        handleSaveProduct={handleSaveProduct}
        handleDelete={handleDelete}
        selectedOrder={selectedOrder}
        setSelectedOrder={setSelectedOrder}
        updateOrderStatus={handleStatusUpdate}
        CATS={CATS}
        EMOJIS={EMOJIS}
        onConfirmLogout={handleConfirmLogout}
      />

      {toast && (
        <div className="toast-wrap">
          <div className={`toast-item ${toast.type}`}>
            {toast.type === "success" ? "✓" : "✕"} {toast.msg}
          </div>
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AdminAppManager />
    </BrowserRouter>
  );
}
