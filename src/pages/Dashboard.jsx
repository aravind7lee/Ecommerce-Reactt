import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { ordersAPI } from '../services/api';
import { User, Heart, ShoppingBag, Package } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const { items: wishlistItems } = useWishlist();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getByUserId(user.uid);
      setOrders(response.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
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

  const renderProfile = () => (
    <div className="card">
      <div className="flex gap-20" style={{ alignItems: 'center', marginBottom: '20px' }}>
        <img 
          src={user.photoURL} 
          alt={user.displayName}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%'
          }}
        />
        <div>
          <h2>{user.displayName}</h2>
          <p style={{ color: '#666' }}>{user.email}</p>
        </div>
      </div>
      
      <div className="grid" style={{
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: 'clamp(10px, 3vw, 20px)',
        textAlign: 'center'
      }}>
        <div className="text-center">
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007bff' }}>
            {orders.length}
          </div>
          <div style={{ color: '#666' }}>Total Orders</div>
        </div>
        
        <div className="text-center">
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc3545' }}>
            {wishlistItems.length}
          </div>
          <div style={{ color: '#666' }}>Wishlist Items</div>
        </div>
        
        <div className="text-center">
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745' }}>
            {orders.filter(order => order.status === 'Delivered').length}
          </div>
          <div style={{ color: '#666' }}>Delivered Orders</div>
        </div>
      </div>
    </div>
  );

  const renderWishlist = () => (
    <div>
      {wishlistItems.length === 0 ? (
        <div className="text-center" style={{ padding: '40px' }}>
          <Heart size={64} style={{ color: '#ccc', marginBottom: '20px' }} />
          <h3>Your wishlist is empty</h3>
          <p style={{ color: '#666' }}>Save products you love for later!</p>
        </div>
      ) : (
        <div className="grid" style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'clamp(10px, 3vw, 15px)'
        }}>
          {wishlistItems.map(item => (
            <div key={item.id} className="card">
              <img 
                src={item.image} 
                alt={item.name}
                style={{
                  width: '100%',
                  height: 'clamp(120px, 20vw, 150px)',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  marginBottom: '10px'
                }}
                onError={(e) => {
                  e.target.src = `https://placehold.co/300x150/007bff/ffffff/png?text=${encodeURIComponent(item.name || 'Product')}`;
                }}
              />
              <h4 style={{ fontSize: 'clamp(1rem, 3vw, 1.1rem)' }}>{item.name}</h4>
              <p style={{ 
                color: '#007bff', 
                fontWeight: 'bold',
                fontSize: 'clamp(0.9rem, 3vw, 1rem)'
              }}>${item.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderOrders = () => (
    <div>
      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center" style={{ padding: '40px' }}>
          <Package size={64} style={{ color: '#ccc', marginBottom: '20px' }} />
          <h3>No orders yet</h3>
          <p style={{ color: '#666' }}>Your order history will appear here.</p>
        </div>
      ) : (
        <div>
          {orders.map(order => (
            <div key={order.id} className="card">
              <div className="flex flex-between" style={{ alignItems: 'center', marginBottom: '15px' }}>
                <div>
                  <h4>Order #{order.id}</h4>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>
                    Placed on {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <span className={getStatusBadgeClass(order.status)}>
                  {order.status}
                </span>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
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

  if (!user) {
    return (
      <div className="container" style={{ paddingTop: '50px' }}>
        <div className="text-center">
          <h2>Please login to view your dashboard</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <h1 style={{ marginBottom: '30px' }}>My Dashboard</h1>
      
      <div className="flex" style={{ 
        marginBottom: 'clamp(20px, 5vw, 30px)',
        gap: 'clamp(8px, 3vw, 20px)',
        flexWrap: 'wrap',
        justifyContent: window.innerWidth < 768 ? 'center' : 'flex-start'
      }}>
        <button
          onClick={() => setActiveTab('profile')}
          className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <User size={16} />
          Profile
        </button>
        
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`btn ${activeTab === 'wishlist' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <Heart size={16} />
          Wishlist ({wishlistItems.length})
        </button>
        
        <button
          onClick={() => setActiveTab('orders')}
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <ShoppingBag size={16} />
          Orders ({orders.length})
        </button>
      </div>

      {activeTab === 'profile' && renderProfile()}
      {activeTab === 'wishlist' && renderWishlist()}
      {activeTab === 'orders' && renderOrders()}
    </div>
  );
};

export default Dashboard;