import React, { useState, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';

const Home = () => {
  const { products, categories, loading, error } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => 
        product.categoryId === parseInt(selectedCategory)
      );
    }

    // Sort products
    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'stock-asc':
            return a.stock - b.stock;
          case 'stock-desc':
            return b.stock - a.stock;
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy]);

  console.log('Home component render - products:', products.length, 'categories:', categories.length);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div>Loading products...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          {error}
          <button onClick={() => window.location.reload()} className="btn btn-primary" style={{marginTop: '10px'}}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 'clamp(15px, 4vw, 20px)' }}>
      <h1 style={{ 
        marginBottom: 'clamp(20px, 5vw, 30px)', 
        textAlign: 'center',
        fontSize: 'clamp(1.8rem, 5vw, 2.5rem)'
      }}>
        Our Products
      </h1>

      <ProductFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        categories={categories}
      />

      {filteredAndSortedProducts.length === 0 ? (
        <div className="text-center" style={{ padding: '40px' }}>
          <h3>No products found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <>
          <div style={{ 
            marginBottom: '20px', 
            color: '#666',
            textAlign: 'center'
          }}>
            Showing {filteredAndSortedProducts.length} of {products.length} products
          </div>
          
          <div className="grid" style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 'clamp(20px, 4vw, 30px)',
            padding: '10px 0'
          }}>
            {filteredAndSortedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;