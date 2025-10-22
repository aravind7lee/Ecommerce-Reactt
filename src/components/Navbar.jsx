import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, LogOut, Heart, Settings, Menu, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setShowUserMenu(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            ShopEase
          </Link>

          <div className="navbar-nav">
            <Link to="/" className="nav-link">Products</Link>
            <Link to="/admin" className="admin-badge">
              <Settings size={14} />
              Admin
            </Link>
          </div>

          <div className="navbar-actions">
            <button 
              className="mobile-menu-btn" 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu size={20} />
            </button>
            
            {user ? (
              <>
                <Link to="/cart" className="nav-icon">
                  <ShoppingCart size={20} />
                  <span className="nav-text">Cart</span>
                  {getTotalItems() > 0 && (
                    <span className="cart-badge">{getTotalItems()}</span>
                  )}
                </Link>

                <Link to="/wishlist" className="nav-icon">
                  <Heart size={20} />
                  <span className="nav-text">Wishlist</span>
                </Link>

                <div className="user-menu">
                  <button 
                    className="user-avatar-btn" 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName} />
                    ) : (
                      <div className="avatar-placeholder">
                        {user.displayName?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                    <ChevronDown size={16} className="dropdown-icon" />
                  </button>
                  
                  {showUserMenu && (
                    <div className="user-dropdown">
                      <Link 
                        to="/dashboard" 
                        className="dropdown-item"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User size={16} />
                        Account
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="dropdown-item logout-btn"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                  
                  <div className="user-actions">
                    <div className="desktop-avatar">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.displayName} />
                      ) : (
                        <div className="avatar-placeholder">
                          {user.displayName?.charAt(0)?.toUpperCase()}
                        </div>
                      )}
                    </div>
                    <Link to="/dashboard" className="btn btn-outline">
                      <User size={16} />
                      Account
                    </Link>
                    <button onClick={handleLogout} className="btn btn-ghost">
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
            )}
          </div>
          
          {showMobileMenu && (
            <div className="mobile-dropdown">
              <Link 
                to="/" 
                className="mobile-nav-link" 
                onClick={() => setShowMobileMenu(false)}
              >
                Products
              </Link>
              <Link 
                to="/admin" 
                className="mobile-nav-link admin-link" 
                onClick={() => setShowMobileMenu(false)}
              >
                <Settings size={16} />
                Admin
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;