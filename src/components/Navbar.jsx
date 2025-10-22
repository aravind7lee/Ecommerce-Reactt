import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, LogOut, Heart } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav style={{
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '0.8rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container">
        <div className="flex mobile-row" style={{ 
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <Link to="/" style={{ 
            fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', 
            fontWeight: 'bold', 
            color: '#007bff',
            textDecoration: 'none'
          }}>
            E-Commerce
          </Link>

          <div className="flex" style={{ 
            alignItems: 'center',
            gap: 'clamp(10px, 3vw, 20px)',
            flexWrap: 'wrap'
          }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>
              Products
            </Link>

            {user ? (
              <>
                <Link 
                  to="/cart" 
                  style={{ 
                    textDecoration: 'none', 
                    color: '#333',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <ShoppingCart size={20} />
                  Cart
                  {getTotalItems() > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px'
                    }}>
                      {getTotalItems()}
                    </span>
                  )}
                </Link>

                <Link 
                  to="/wishlist" 
                  style={{ 
                    textDecoration: 'none', 
                    color: '#333',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <Heart size={20} />
                  Wishlist
                </Link>

                <div style={{ 
                  position: 'relative', 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  flexWrap: 'wrap'
                }}>
                  <div className="flex" style={{ 
                    alignItems: 'center',
                    gap: '8px',
                    flexWrap: 'wrap'
                  }}>
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={user.displayName}
                        style={{
                          width: 'clamp(28px, 5vw, 32px)',
                          height: 'clamp(28px, 5vw, 32px)',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid #007bff'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      style={{
                        width: 'clamp(28px, 5vw, 32px)',
                        height: 'clamp(28px, 5vw, 32px)',
                        borderRadius: '50%',
                        backgroundColor: '#007bff',
                        color: 'white',
                        display: user.photoURL ? 'none' : 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 'clamp(12px, 3vw, 14px)',
                        fontWeight: 'bold'
                      }}
                    >
                      {user.displayName?.charAt(0)?.toUpperCase()}
                    </div>
                    <span style={{ 
                      fontSize: 'clamp(12px, 3vw, 14px)',
                      display: window.innerWidth < 480 ? 'none' : 'inline',
                      maxWidth: '100px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {user.displayName}
                    </span>
                    <div className="flex" style={{ gap: '5px', flexWrap: 'wrap' }}>
                      <Link 
                        to="/dashboard" 
                        className="btn btn-primary btn-small"
                        style={{ 
                          padding: '6px 8px', 
                          fontSize: 'clamp(10px, 2.5vw, 12px)',
                          minHeight: 'auto',
                          width: 'auto'
                        }}
                      >
                        <User size={14} style={{ marginRight: '3px' }} />
                        <span className="mobile-hidden">Dashboard</span>
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="btn btn-secondary btn-small"
                        style={{ 
                          padding: '6px 8px', 
                          fontSize: 'clamp(10px, 2.5vw, 12px)',
                          minHeight: 'auto',
                          width: 'auto'
                        }}
                      >
                        <LogOut size={14} style={{ marginRight: '3px' }} />
                        <span className="mobile-hidden">Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;