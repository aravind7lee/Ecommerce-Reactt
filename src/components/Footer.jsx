import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-left">
            <span className="footer-brand">ShopEase</span>
            <span className="footer-links">
              <Link to="/">Products</Link>
              <Link to="/cart">Cart</Link>
              <Link to="/wishlist">Wishlist</Link>
              <Link to="/dashboard">Account</Link>
            </span>
          </div>
          
          <div className="footer-right">
            <Link to="/admin" className="admin-link">Admin Panel</Link>
            <span className="footer-copyright">© 2025 ShopEase</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;