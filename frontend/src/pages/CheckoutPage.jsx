// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getCart, clearCart } from '../utils/cartStorage';

export default function CheckoutPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // Load the correct cart on mount
  useEffect(() => {
    setCartItems(getCart(user));
  }, [user]);

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    // Assuming items belong to the same shop for this simplified checkout view
    const shopId = cartItems[0].shop_id; 
    const items = cartItems.map(item => ({
      listing_id: item.id,
      quantity: item.quantity
    }));

    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/orders', { shop_id: shopId, items });
      
      // Clear the cart securely using our utility
      clearCart(user);
      
      // Navigate back to the customer dashboard to view the pending order
      navigate('/dashboard'); 
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-extrabold text-[var(--text-main)]">Checkout Order</h1>
      
      {error && <p className="p-3 bg-red-500/10 text-red-500 rounded-lg text-sm font-medium">{error}</p>}
      
      {cartItems.length > 0 ? (
        <>
          <div className="bg-[var(--bg-secondary)] p-4 rounded-xl shadow-sm border border-[var(--border-color)]">
            <p className="text-sm font-medium mb-2">Order Summary ({cartItems.length} items)</p>
            {/* Quick list of items being bought */}
            <ul className="text-sm opacity-80 space-y-1">
              {cartItems.map((item, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{item.quantity}x {item.title || 'Product'}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm opacity-70">Confirm your details to dispatch the order to the shop.</p>
          
          <button 
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md disabled:opacity-50 transition-colors"
          >
            {loading ? 'Processing Transaction...' : 'Confirm & Place Order'}
          </button>
        </>
      ) : (
        <p className="text-sm opacity-70">There are no items in your cart to checkout.</p>
      )}
    </div>
  );
}