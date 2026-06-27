import React, { useState } from "react";

export function OrdersTable({ items = [], updateOrderStatus }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter the items array based on the customer name, order ID, or city
  const filteredItems = items.filter(
    (item) =>
      item.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.city?.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  console.log(filteredItems);

  const handleActionClick = (id) => {
    console.log(`Managing item ID: ${id}`);
    // Your action modal or routing logic goes here
  };

  return (
    <div className="table-card">
      {/* Header with Search Actions */}
      <div className="table-header">
        <div>
          <h3>Recent Orders</h3>
          <p>Latest customer orders</p>
        </div>
        <div className="table-actions">
          <input
            className="search-box"
            placeholder="🔍 Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Responsive Wrapper for the Table */}
      <div className="table-wrap">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Address</th>
              <th>Product</th>
              <th>Price</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong>{order.id}</strong>
                  </td>
                  <td>{order.customer}</td>
                  <td>{order.addrress}</td>
                  <td>{order.product}</td>
                  <td>{order.price}</td>
                  <td>{order.date}</td>
                  <td>
                    {/* Dynamic global class allocation based on delivery status */}
                    {
                      <td>
                        <select
                          class="status-sel"
                          onChange="updateOrderStatus('${filteredItems.id}',this.value)"
                        >
                          $
                          {["Pending", "Processing", "Delivered", "Cancelled"]
                            .map(
                              (s) =>
                                `<option${s === items.status ? " selected" : ""}>${s}</option>`,
                            )
                            .join("")}
                        </select>
                      </td>
                    }
                    {/* <span
                      className={`badge ${order.status?.toLowerCase() || ""}`}
                    >
                      {order.status}
                    </span> */}
                  </td>
                  <td>
                    <button
                      className="action-btn"
                      onClick={() => handleActionClick(order.id)}
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  No matching records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
