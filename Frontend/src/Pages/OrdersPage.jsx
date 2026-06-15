import React, { useState, useEffect } from 'react';
import { getMyOrders } from '../services/api';
import './OrdersPage.css';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1 className="orders-title">My Orders</h1>

        {loading ? (
          <p className="orders-empty">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="orders-empty">No orders yet.</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <span className="order-id">#{order._id.slice(-8)}</span>
                  <span className={`order-status status-${order.status}`}>{order.status}</span>
                  <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="order-items">
                  {order.items.map((item, i) => (
                    <div key={i} className="order-item-row">
                      <span className="order-item-name">{item.name} x{item.quantity}</span>
                      <span className="order-item-price">{item.price}</span>
                    </div>
                  ))}
                </div>
                <div className="order-total">
                  <span>Total</span>
                  <span className="order-total-amount">{order.total}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
