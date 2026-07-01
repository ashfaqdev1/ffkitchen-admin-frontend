import React, { useEffect, useState } from "react";

export default function ModalManager({
  modal,
  setModal,
  editData,
  setEditData,
  editId,
  handleSaveProduct,
  handleDelete,
  CATS,
  onConfirmLogout,
}) {
  const [previewUrl, setPreviewUrl] = useState("");
  const backendBaseUrl = "http://localhost:5000";

  useEffect(() => {
    if (editData && (modal === "add" || modal === "edit")) {
      if (editData.imageFile) {
        // 1. Generate live window snapshot for files staged locally
        const objectUrl = URL.createObjectURL(editData.imageFile);
        setPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl); // Clean up memory
      } else if (editData.imageUrl) {
        // 2. Load the asset stream address served directly from your storage target
        setPreviewUrl(
          editData.imageUrl.startsWith("http")
            ? editData.imageUrl
            : `${backendBaseUrl}${editData.imageUrl}`,
        );
      } else {
        // 3. Simple fallback placeholder string path
        setPreviewUrl("https://placehold.co/150x150?text=No+Image");
      }
    }
  }, [editData?.imageFile, editData?.imageUrl, modal]);

  if (!modal) return null;

  return (
    <>
      {/* ─── ADD / EDIT PRODUCT MODAL ────────────────────────────────────── */}
      {(modal === "add" || modal === "edit") && (
        <div className="modal-overlay open" onClick={() => setModal(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{modal === "add" ? "Add New Product" : "Edit Product"}</h3>
              <button className="modal-close" onClick={() => setModal(null)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveProduct();
                }}
              >
                <div className="form-row">
                  <div className="form-group">
                    <label>Product Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="e.g. Royal Dinner Set"
                      value={editData?.name || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                    />
                  </div>

                  {/* 🔄 CHANGED FROM SELECT TO INPUT WITH DATALIST */}
                  <div className="form-group">
                    <label>Category *</label>
                    <input
                      type="text"
                      list="category-suggestions"
                      className="form-control"
                      placeholder="Type or select category"
                      required
                      value={editData?.category || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, category: e.target.value })
                      }
                    />
                    {/* Yeh user ko existing categories ki suggestions dikhayega */}
                    <datalist id="category-suggestions">
                      {CATS?.map((cat) => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                  </div>

                  <div className="form-group">
                    <label>Price *</label>
                    <input
                      type="number"
                      className="form-control"
                      required
                      min="0"
                      placeholder="0"
                      value={editData?.price || ""}
                      onChange={(e) =>
                        setEditData({ ...editData, price: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Stock *</label>
                    <input
                      type="number"
                      className="form-control"
                      required
                      min="0"
                      placeholder="0"
                      value={editData?.stock ?? ""}
                      onChange={(e) =>
                        setEditData({ ...editData, stock: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Enter item details..."
                    value={editData?.desc || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, desc: e.target.value })
                    }
                  />
                </div>

                {/* IMAGE PREVIEW GENERATOR */}
                <div
                  className="form-group"
                  style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "center",
                    marginTop: "12px",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <label>Product Image File</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setEditData({ ...editData, imageFile: file });
                        }
                      }}
                    />
                  </div>

                  <div
                    style={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                      overflow: "hidden",
                      background: "#f9f9f9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: "18px",
                    }}
                  >
                    <img
                      src={previewUrl}
                      alt="Product preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.src =
                          "https://placehold.co/150x150?text=Error";
                      }}
                    />
                  </div>
                </div>

                <div className="modal-footer" style={{ marginTop: "20px" }}>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setModal(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {modal === "add" ? "Create Product" : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ─── DELETE CONFIRMATION MODAL ──────────────────────────────────── */}
      {modal === "delete" && (
        <div className="modal-overlay open" onClick={() => setModal(null)}>
          <div className="modal-box sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-body">
              <div className="confirm-center">
                <div className="confirm-icon">🗑️</div>
                <h3>Remove Product?</h3>
                <p>
                  Are you sure you want to permanently delete this item? This
                  process cannot be undone.
                </p>
              </div>
              <div
                className="modal-footer"
                style={{ justifyContent: "center", marginTop: "14px" }}
              >
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setModal(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── LOGOUT CONFIRMATION MODAL ──────────────────────────────────── */}
      {modal === "logout" && (
        <div className="modal-overlay open" onClick={() => setModal(null)}>
          <div className="modal-box sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-body">
              <div className="confirm-center">
                <div
                  className="confirm-icon"
                  style={{ color: "var(--yellow)" }}
                >
                  🚪
                </div>
                <h3>Logout?</h3>
                <p>
                  Are you sure you want to terminate your current admin session?
                </p>
              </div>
              <div
                className="modal-footer"
                style={{ justifyContent: "center", marginTop: "14px" }}
              >
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setModal(null)}
                >
                  Stay
                </button>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => {
                    setModal(null);
                    if (onConfirmLogout) onConfirmLogout();
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
