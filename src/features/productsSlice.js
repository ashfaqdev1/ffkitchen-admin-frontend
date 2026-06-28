import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// const API =
// ─── 1. FETCH ALL PRODUCTS FROM SERVER ──────────────────────────────
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/v1/product/read", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (!response.ok) {
        return rejectWithValue(
          result.message || "Failed to fetch inventory data.",
        );
      }
      console.log(result);
      return result.data.map((item) => ({
        id: item._id,
        name: item.title || "",
        desc: item.desc || "",
        category: item.category || "Dinner Sets",
        price: item.price || 0,
        stock: item.stock !== undefined ? item.stock : 0,
        status: item.status || "Active",
        imageUrl: item.imageUrl || "", // 🚀 Use imageUrl consistently
      }));
    } catch (err) {
      return rejectWithValue(err.message || "Network communication failure.");
    }
  },
);

// ─── 2. CREATE NEW PRODUCT ON SERVER ────────────────────────────────
export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("title", productData.name);
      formData.append("desc", productData.desc || "");
      formData.append("category", productData.category);
      formData.append("price", Number(productData.price));
      formData.append("stock", Number(productData.stock));
      formData.append("status", productData.status || "Active");

      if (productData.imageFile) {
        formData.append("image", productData.imageFile); // 'image' field matches Multer
      }

      const response = await fetch("/api/v1/product/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (!response.ok)
        return rejectWithValue(result.message || "Failed to create product.");

      const newItem = result.data;
      return {
        id: newItem._id,
        name: newItem.title,
        desc: newItem.desc,
        category: newItem.category,
        price: newItem.price,
        stock: newItem.stock,
        status: newItem.status,
        imageUrl: newItem.imageUrl, // 🚀 Sync with backend schema
      };
    } catch (err) {
      return rejectWithValue(err.message || "Could not save item to server.");
    }
  },
);

// ─── 3. UPDATE/EDIT PRODUCT ON SERVER ───────────────────────────────
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("title", updatedData.name);
      formData.append("desc", updatedData.desc || "");
      formData.append("category", updatedData.category);
      formData.append("price", Number(updatedData.price));
      formData.append("stock", Number(updatedData.stock));
      formData.append("status", updatedData.status);

      if (updatedData.imageFile) {
        formData.append("image", updatedData.imageFile);
      }

      const response = await fetch(`/api/v1/product/edit/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (!response.ok)
        return rejectWithValue(result.message || "Failed to update item.");

      const updatedItem = result.data;
      return {
        id: updatedItem._id,
        name: updatedItem.title,
        desc: updatedItem.desc,
        category: updatedItem.category,
        price: updatedItem.price,
        stock: updatedItem.stock,
        status: updatedItem.status,
        imageUrl: updatedItem.imageUrl, // 🚀 Sync with backend schema
      };
    } catch (err) {
      return rejectWithValue(err.message || "Could not save adjustments.");
    }
  },
);

// ─── 4. DELETE PRODUCT FROM SERVER ──────────────────────────────────
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/product/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await response.json();
      if (!response.ok)
        return rejectWithValue(result.message || "Failed to delete item.");
      return id;
    } catch (err) {
      return rejectWithValue(
        err.message || "Network exception tracking execution.",
      );
    }
  },
);

const productsSlice = createSlice({
  name: "products",
  initialState: { items: [], loading: false, error: null },
  reducers: {
    clearProductErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export const { clearProductErrors } = productsSlice.actions;
export default productsSlice.reducer;
