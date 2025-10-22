import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { user } = useAuth();
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();

  if (!user) {
    return (
      <div className="container" style={{ paddingTop: '50px' }}>
        <div className="text-center">
          <h2>Please login to view your cart</h2>
          <Link to="/login" className="btn btn-primary mt-20">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container" style={{ paddingTop: '50px' }}>
        <div className="text-center">
          <ShoppingBag size={64} style={{ color: '#ccc', marginBottom: '20px' }} />
          <h2>Your cart is empty</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Add some products to get started!
          </p>
          <Link to="/" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <div className="flex flex-between" style={{ alignItems: 'center', marginBottom: '30px' }}>
        <h1>Shopping Cart</h1>
        <button 
          onClick={clearCart}
          className="btn btn-danger"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid" style={{
        gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '2fr 1fr',
        gap: 'clamp(15px, 4vw, 20px)'
      }}>
        <div>
          {items.map(item => (
            <div key={item.id} className="card">
              <div className="flex gap-20">
                <img 
                  src={item.image} 
                  alt={item.name}
                  style={{
                    width: 'clamp(80px, 15vw, 100px)',
                    height: 'clamp(80px, 15vw, 100px)',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    flexShrink: 0
                  }}
                  onError={(e) => {
                    e.target.src = `https://placehold.co/100x100/007bff/ffffff/png?text=${encodeURIComponent(item.name || 'Item')}`;
                  }}
                />
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: '10px' }}>{item.name}</h3>
                  <p style={{ color: '#666', marginBottom: '10px' }}>
                    ₹{item.price.toLocaleString('en-IN')} each
                  </p>
                  
                  <div className="flex" style={{ 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}>
                    <div className="flex" style={{ 
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="btn btn-secondary"
                        style={{ padding: '5px 10px' }}
                      >
                        <Minus size={16} />
                      </button>
                      
                      <span style={{ 
                        padding: '5px 15px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        minWidth: '50px',
                        textAlign: 'center'
                      }}>
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="btn btn-secondary"
                        style={{ padding: '5px 10px' }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <div className="flex" style={{ 
                      alignItems: 'center',
                      gap: '8px',
                      flexWrap: 'wrap'
                    }}>
                      <span style={{ fontWeight: 'bold' }}>
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                      
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="btn btn-danger"
                        style={{ padding: '5px 10px' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="card">
            <h3 style={{ marginBottom: '20px' }}>Order Summary</h3>
            
            <div className="flex flex-between mb-10">
              <span>Subtotal:</span>
              <span>₹{getTotalPrice().toLocaleString('en-IN')}</span>
            </div>
            
            <div className="flex flex-between mb-10">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            
            <div className="flex flex-between mb-20" style={{ 
              borderTop: '1px solid #eee',
              paddingTop: '10px',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}>
              <span>Total:</span>
              <span>₹{getTotalPrice().toLocaleString('en-IN')}</span>
            </div>
            
            <Link 
              to="/checkout" 
              className="btn btn-primary"
              style={{ width: '100%', textAlign: 'center' }}
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;