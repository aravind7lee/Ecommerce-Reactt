import React, { useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';
import { Package, Edit } from 'lucide-react';

const AdminPanel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getAll();
      setOrders(response.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        const updatedOrder = { ...order, status: newStatus };
        await ordersAPI.update(orderId, updatedOrder);
        setOrders(orders.map(o => o.id === orderId ? updatedOrder : o));
        setEditingOrder(null);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'On Process':
        return 'badge badge-warning';
      case 'Shipped':
        return 'badge badge-info';
      case 'Delivered':
        return 'badge badge-success';
      default:
        return 'badge badge-secondary';
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '50px' }}>
        <div className="loading">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <h1 style={{ marginBottom: '30px' }}>Admin Panel - Order Management</h1>
      
      <div className="card" style={{ marginBottom: 'clamp(15px, 4vw, 20px)' }}>
        <div className="grid" style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
          gap: 'clamp(10px, 3vw, 20px)',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ffc107' }}>
              {orders.filter(o => o.status === 'On Process').length}
            </div>
            <div style={{ color: '#666' }}>Processing</div>
          </div>
          
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#17a2b8' }}>
              {orders.filter(o => o.status === 'Shipped').length}
            </div>
            <div style={{ color: '#666' }}>Shipped</div>
          </div>
          
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
              {orders.filter(o => o.status === 'Delivered').length}
            </div>
            <div style={{ color: '#666' }}>Delivered</div>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center" style={{ padding: '40px' }}>
          <Package size={64} style={{ color: '#ccc', marginBottom: '20px' }} />
          <h3>No orders found</h3>
          <p style={{ color: '#666' }}>Orders will appear here when customers place them.</p>
        </div>
      ) : (
        <div>
          {orders.map(order => (
            <div key={order.id} className="card">
              <div className="flex flex-between" style={{ alignItems: 'center', marginBottom: '15px' }}>
                <div>
                  <h4>Order #{order.id}</h4>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>
                    Customer ID: {order.userId}
                  </p>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>
                    Placed on {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex gap-10" style={{ alignItems: 'center' }}>
                  {editingOrder === order.id ? (
                    <div className="flex gap-10">
                      <select
                        defaultValue={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        style={{ padding: '5px' }}
                      >
                        <option value="On Process">On Process</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                      <button
                        onClick={() => setEditingOrder(null)}
                        className="btn btn-secondary"
                        style={{ padding: '5px 10px' }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className={getStatusBadgeClass(order.status)}>
                        {order.status}
                      </span>
                      <button
                        onClick={() => setEditingOrder(order.id)}
                        className="btn btn-primary"
                        style={{ padding: '5px 10px' }}
                      >
                        <Edit size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <h5 style={{ marginBottom: '10px' }}>Items:</h5>
                {order.items.map(item => (
                  <div key={item.id} className="flex flex-between mb-10">
                    <span>{item.name} x {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-between" style={{ 
                borderTop: '1px solid #eee',
                paddingTop: '10px',
                fontWeight: 'bold'
              }}>
                <span>Total Amount:</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;