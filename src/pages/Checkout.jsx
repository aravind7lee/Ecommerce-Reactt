import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { addressesAPI, ordersAPI } from '../services/api';
import { Plus, MapPin } from 'lucide-react';

const Checkout = () => {
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      console.log('Fetching addresses for user:', user.uid);
      const response = await addressesAPI.getByUserId(user.uid);
      console.log('Addresses fetched:', response.data);
      
      setAddresses(response.data || []);
      
      // Auto-select default address if available
      const defaultAddress = response.data?.find(addr => addr.isDefault);
      if (defaultAddress && !selectedAddress) {
        setSelectedAddress(defaultAddress.id);
      }
      
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setAddresses([]);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!newAddress.name || !newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zipCode || !newAddress.country) {
      alert('Please fill in all address fields');
      return;
    }
    
    try {
      const addressData = {
        ...newAddress,
        userId: user.uid,
        id: `ADDR-${Date.now()}`,
        isDefault: addresses.length === 0, // First address is default
        createdAt: new Date().toISOString()
      };
      
      console.log('Adding address:', addressData);
      
      const response = await addressesAPI.create(addressData);
      console.log('Address created:', response.data);
      
      // Update local state
      const updatedAddresses = [...addresses, addressData];
      setAddresses(updatedAddresses);
      
      // Auto-select the new address
      setSelectedAddress(addressData.id);
      
      // Reset form
      setNewAddress({
        name: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      });
      setShowAddressForm(false);
      
      alert('Address added successfully!');
      
    } catch (error) {
      console.error('Error adding address:', error);
      alert('Failed to add address. Please try again.');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }

    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      setLoading(true);
      
      // Find selected address details
      const selectedAddressDetails = addresses.find(addr => addr.id === selectedAddress);
      
      const order = {
        id: `ORD-${Date.now()}`,
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          total: item.price * item.quantity
        })),
        totalAmount: getTotalPrice(),
        shippingAddress: selectedAddressDetails,
        status: 'On Process',
        orderDate: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        paymentMethod: 'Cash on Delivery',
        orderNotes: 'Order placed successfully'
      };

      console.log('Placing order:', order);
      
      const response = await ordersAPI.create(order);
      console.log('Order created:', response.data);
      
      // Clear cart after successful order
      clearCart();
      
      // Show success message
      alert(`Order placed successfully! Order ID: ${order.id}`);
      
      // Navigate to dashboard orders tab
      navigate('/dashboard?tab=orders');
      
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
  }, [user, items.length, navigate]);

  if (!user || items.length === 0) {
    return null;
  }

  return (
    <div className="container" style={{ paddingTop: '20px' }}>
      <h1 style={{ marginBottom: '30px' }}>Checkout</h1>

      <div className="grid" style={{
        gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr',
        gap: 'clamp(15px, 4vw, 20px)'
      }}>
        <div>
          <div className="card">
            <div className="flex flex-between" style={{ alignItems: 'center', marginBottom: '20px' }}>
              <h3>Delivery Address</h3>
              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <Plus size={16} />
                Add Address
              </button>
            </div>

            {showAddressForm && (
              <form onSubmit={handleAddAddress} style={{ marginBottom: '20px' }}>
                <div className="grid" style={{
                  gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr',
                  gap: '10px'
                }}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={newAddress.name}
                      onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Street Address</label>
                    <input
                      type="text"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>ZIP Code</label>
                    <input
                      type="text"
                      value={newAddress.zipCode}
                      onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <input
                      type="text"
                      value={newAddress.country}
                      onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-10">
                  <button type="submit" className="btn btn-primary">
                    Save Address
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowAddressForm(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {addresses.length === 0 ? (
              <div className="text-center" style={{ padding: '20px', color: '#666' }}>
                <MapPin size={48} style={{ marginBottom: '10px' }} />
                <p>No addresses found. Please add a delivery address.</p>
              </div>
            ) : (
              <div>
                {addresses.map(address => (
                  <div 
                    key={address.id}
                    className={`card ${selectedAddress === address.id ? 'selected' : ''}`}
                    style={{
                      cursor: 'pointer',
                      border: selectedAddress === address.id ? '2px solid #007bff' : '1px solid #ddd',
                      marginBottom: '10px'
                    }}
                    onClick={() => setSelectedAddress(address.id)}
                  >
                    <div className="flex gap-10">
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress === address.id}
                        onChange={() => setSelectedAddress(address.id)}
                      />
                      <div>
                        <h4>{address.name}</h4>
                        <p>{address.street}</p>
                        <p>{address.city}, {address.state} {address.zipCode}</p>
                        <p>{address.country}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="card">
            <h3 style={{ marginBottom: '20px' }}>Order Summary</h3>
            
            {items.map(item => (
              <div key={item.id} className="flex flex-between mb-10">
                <span>{item.name} x {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
            
            <div style={{ borderTop: '1px solid #eee', paddingTop: '10px', marginTop: '10px' }}>
              <div className="flex flex-between mb-10">
                <span>Subtotal:</span>
                <span>₹{getTotalPrice().toLocaleString('en-IN')}</span>
              </div>
              
              <div className="flex flex-between mb-10">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              
              <div className="flex flex-between mb-20" style={{ 
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}>
                <span>Total:</span>
                <span>₹{getTotalPrice().toLocaleString('en-IN')}</span>
              </div>
            </div>
            
            <button
              onClick={handlePlaceOrder}
              disabled={loading || !selectedAddress || items.length === 0}
              className="btn btn-primary"
              style={{ 
                width: '100%',
                fontSize: '16px',
                padding: '15px',
                fontWeight: 'bold'
              }}
            >
              {loading ? (
                <>
                  <span>🔄</span> Placing Order...
                </>
              ) : (
                <>
                  <span>🛒</span> Place Order - ₹{getTotalPrice().toLocaleString('en-IN')}
                </>
              )}
            </button>
            
            {!selectedAddress && (
              <p style={{ 
                color: '#dc3545', 
                fontSize: '14px', 
                textAlign: 'center',
                marginTop: '10px'
              }}>
                Please select a delivery address to continue
              </p>
            )}
            
            {items.length === 0 && (
              <p style={{ 
                color: '#dc3545', 
                fontSize: '14px', 
                textAlign: 'center',
                marginTop: '10px'
              }}>
                Your cart is empty
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;