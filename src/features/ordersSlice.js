import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async Thunk: Fetch All Orders
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/v1/order/orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch orders");
    }
  },
);

// Async Thunk: Update Order Status in Backend (Strictly using _id in params)
export const updateOrderStatusBackend = createAsyncThunk(
  "orders/updateOrderStatusBackend",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      // Request url me strictly _id (jo id variable me pass ho rha hai) jayega
      const response = await fetch(`/api/v1/order/edit/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderStatus: status }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.status}`);
      }

      return { id, status };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update status");
    }
  },
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        let incomingOrders = [];

        if (Array.isArray(action.payload)) {
          incomingOrders = action.payload;
        } else if (action.payload && Array.isArray(action.payload.orders)) {
          incomingOrders = action.payload.orders;
        }

        // FIXED: Date ko chorr kar strictly standard 'id' string ke mutabik descending order me sort kiya
        state.items = incomingOrders.sort((a, b) => {
          const idA = String(a.id || "");
          const idB = String(b.id || "");
          return idB.localeCompare(idA, undefined, {
            numeric: true,
            sensitivity: "base",
          });
        });
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.items = [];
        state.error = action.payload;
      })

      // FIXED: List find matching custom id tracking
      .addCase(updateOrderStatusBackend.fulfilled, (state, action) => {
        // Find inside items array using backend matching index target key
        const order = state.items.find(
          (o) => o._id === action.payload.id || o.id === action.payload.id,
        );
        if (order) {
          order.orderStatus = action.payload.status;
        }
      });
  },
});

export default ordersSlice.reducer;
