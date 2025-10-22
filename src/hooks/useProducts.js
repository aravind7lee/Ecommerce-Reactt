import { useState, useEffect } from 'react';
import { productsAPI, categoriesAPI } from '../services/api';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('useProducts hook mounted, fetching data...');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching products and categories...');
      
      const [productsResponse, categoriesResponse] = await Promise.all([
        productsAPI.getAll(),
        categoriesAPI.getAll()
      ]);
      
      console.log('Products response:', productsResponse.data);
      console.log('Categories response:', categoriesResponse.data);
      
      setProducts(productsResponse.data || []);
      setCategories(categoriesResponse.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProductStock = async (productId, newStock) => {
    try {
      const product = products.find(p => p.id === productId);
      if (product) {
        const updatedProduct = { ...product, stock: newStock };
        await productsAPI.update(productId, updatedProduct);
        setProducts(products.map(p => p.id === productId ? updatedProduct : p));
      }
    } catch (err) {
      console.error('Error updating product stock:', err);
    }
  };

  return {
    products,
    categories,
    loading,
    error,
    refetch: fetchData,
    updateProductStock
  };
};