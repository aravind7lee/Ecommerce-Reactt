import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { Heart } from 'lucide-react';

const Wishlist = () => {
  const { user } = useAuth();
  const { items } = useWishlist();

  if (!user) {
    return (
      <div className="container" style={{ paddingTop: '50px' }}>
        <div className="text-center">
          <h2>Please login to view your wishlist</h2>
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
          <Heart size={64} style={{ color: '#ccc', marginBottom: '20px' }} />
          <h2>Your wishlist is empty</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Save products you love for later!
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
      <h1 style={{ marginBottom: '30px' }}>My Wishlist</h1>
      
      <div style={{ 
        marginBottom: '20px', 
        color: '#666' 
      }}>
        {items.length} item{items.length !== 1 ? 's' : ''} in your wishlist
      </div>

      <div className="grid" style={{
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 'clamp(20px, 4vw, 30px)',
        padding: '10px 0'
      }}>
        {items.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;