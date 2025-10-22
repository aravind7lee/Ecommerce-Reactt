import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ShoppingCart, Heart, HeartOff } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = () => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    if (product.stock === 0) {
      alert('Product is out of stock');
      return;
    }
    addToCart(product);
  };

  const handleWishlistToggle = () => {
    if (!user) {
      alert('Please login to add items to wishlist');
      return;
    }
    if (product.stock === 0) {
      alert('Cannot add out of stock items to wishlist');
      return;
    }
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div 
      className="card" 
      style={{ 
        position: 'relative',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      }}
    >
      {product.stock === 0 && (
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          backgroundColor: '#dc3545',
          color: 'white',
          padding: '4px 6px',
          borderRadius: '4px',
          fontSize: 'clamp(10px, 2.5vw, 12px)',
          zIndex: 1
        }}>
          Out of Stock
        </div>
      )}

      <img 
        src={product.image} 
        alt={product.name}
        style={{
          width: '100%',
          height: 'clamp(200px, 25vw, 250px)',
          objectFit: 'cover',
          borderRadius: '8px',
          marginBottom: '15px',
          opacity: product.stock === 0 ? 0.5 : 1,
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.05)';
          e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = 'none';
        }}
        onError={(e) => {
          console.log('Image failed to load:', product.image);
          e.target.src = 'https://via.placeholder.com/400x400/007bff/ffffff?text=Product';
        }}
      />
      
      <div style={{ padding: '0 5px' }}>
        <h3 style={{ 
          marginBottom: '8px', 
          fontSize: 'clamp(1rem, 3vw, 1.1rem)',
          fontWeight: '600',
          color: '#333',
          lineHeight: '1.3'
        }}>
          {product.name}
        </h3>
        
        <p style={{ 
          color: '#666', 
          marginBottom: '12px',
          fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
          lineHeight: '1.4',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {product.description}
        </p>
        
        <div className="flex" style={{ 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '15px',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <span style={{ 
            fontSize: 'clamp(1.1rem, 4vw, 1.3rem)', 
            fontWeight: 'bold', 
            color: '#007bff',
            textShadow: '0 1px 2px rgba(0,123,255,0.1)'
          }}>
            ${product.price}
          </span>
          <span style={{ 
            fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
            padding: '4px 8px',
            borderRadius: '12px',
            backgroundColor: product.stock > 0 ? '#e8f5e8' : '#ffeaea',
            color: product.stock > 0 ? '#28a745' : '#dc3545',
            fontWeight: '500'
          }}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>

      <div className="flex" style={{ gap: '8px', flexWrap: 'wrap' }}>
        <button 
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="btn btn-primary"
          style={{ 
            flex: 1,
            minWidth: '120px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            fontSize: 'clamp(12px, 3vw, 14px)',
            padding: 'clamp(8px, 2vw, 10px) clamp(12px, 3vw, 20px)'
          }}
        >
          <ShoppingCart size={window.innerWidth < 480 ? 14 : 16} />
          <span>Add to Cart</span>
        </button>
        
        <button 
          onClick={handleWishlistToggle}
          disabled={product.stock === 0}
          className={`btn ${isInWishlist(product.id) ? 'btn-danger' : 'btn-secondary'}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(8px, 2vw, 10px)',
            minWidth: '44px',
            width: 'auto'
          }}
        >
          {isInWishlist(product.id) ? 
            <HeartOff size={window.innerWidth < 480 ? 14 : 16} /> : 
            <Heart size={window.innerWidth < 480 ? 14 : 16} />
          }
        </button>
      </div>
    </div>
  );
};

export default ProductCard;