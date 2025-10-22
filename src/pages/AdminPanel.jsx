import React, { useState, useEffect } from 'react';
import { ordersAPI, productsAPI } from '../services/api';
import { Package, Edit, Plus } from 'lucide-react';

const AdminPanel = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('orders');
  const [restockInputs, setRestockInputs] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      await Promise.all([fetchOrders(), fetchProducts()]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getAll();
      setOrders(response.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      const allProds = response.data || [];
      setAllProducts(allProds);
      setProducts(allProds.filter(p => p.stock <= 5).sort((a, b) => a.stock - b.stock));
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  const restockProduct = async (productId) => {
    const newStock = restockInputs[productId];
    if (!newStock || newStock < 0) {
      alert('Please enter a valid stock number');
      return;
    }

    try {
      const product = allProducts.find(p => p.id === productId);
      if (!product) {
        alert('Product not found');
        return;
      }

      const updatedProduct = { ...product, stock: parseInt(newStock) };
      await productsAPI.update(productId, updatedProduct);
      
      const updatedProducts = allProducts.map(p => 
        p.id === productId ? updatedProduct : p
      );
      setAllProducts(updatedProducts);
      setProducts(updatedProducts.filter(p => p.stock <= 5).sort((a, b) => a.stock - b.stock));
      
      setRestockInputs(prev => ({ ...prev, [productId]: '' }));
      alert(`${product.name} restocked to ${newStock} units successfully!`);
    } catch (error) {
      console.error('Error restocking product:', error);
      alert('Failed to restock product. Please try again.');
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

  const handleInputChange = (productId, value) => {
    setRestockInputs(prev => ({ ...prev, [productId]: value }));
  };

  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '50px' }}>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <h1 style={{ marginBottom: '30px' }}>Admin Panel</h1>
      
      <div style={{ marginBottom: '30px' }}>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ marginRight: '10px' }}
        >
          Orders ({orders.length})
        </button>
        <button 
          onClick={() => setActiveTab('stock')}
          className={`btn ${activeTab === 'stock' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Stock Management ({products.length})
        </button>
      </div>

      {activeTab === 'orders' && (
        <>
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="grid" style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
              gap: '20px',
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
                        <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-between" style={{ 
                    borderTop: '1px solid #eee',
                    paddingTop: '10px',
                    fontWeight: 'bold'
                  }}>
                    <span>Total Amount:</span>
                    <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'stock' && (
        <div>
          <h2 style={{ marginBottom: '20px' }}>Low Stock & Out of Stock Products</h2>
          {products.length === 0 ? (
            <div className="text-center" style={{ padding: '40px' }}>
              <Package size={64} style={{ color: '#28a745', marginBottom: '20px' }} />
              <h3>All products are well stocked!</h3>
              <p style={{ color: '#666' }}>No products need restocking at this time.</p>
            </div>
          ) : (
            <div>
              {products.map(product => (
                <div key={product.id} className="card">
                  <div className="flex flex-between" style={{ alignItems: 'center' }}>
                    <div>
                      <h4>{product.name}</h4>
                      <p style={{ color: '#666', fontSize: '0.9rem' }}>
                        Current Stock: <span style={{ 
                          color: product.stock === 0 ? '#dc3545' : product.stock <= 5 ? '#ffc107' : '#28a745',
                          fontWeight: 'bold'
                        }}>
                          {product.stock} units
                        </span>
                      </p>
                      <p style={{ color: '#666', fontSize: '0.9rem' }}>Price: ₹{product.price.toLocaleString('en-IN')}</p>
                    </div>
                    
                    <div className="flex gap-10" style={{ alignItems: 'center' }}>
                      <input 
                        type="number" 
                        min="0" 
                        placeholder="New stock"
                        value={restockInputs[product.id] || ''}
                        onChange={(e) => handleInputChange(product.id, e.target.value)}
                        style={{ width: '100px', padding: '5px' }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            restockProduct(product.id);
                          }
                        }}
                      />
                      <button
                        onClick={() => restockProduct(product.id)}
                        className="btn btn-success"
                        style={{ padding: '5px 10px' }}
                      >
                        <Plus size={16} /> Restock
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;