import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePlaceOrder = async () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) return;

    // Assuming items belong to the same shop for this simplified checkout view
    const shopId = cart[0].shop_id; 
    const items = cart.map(item => ({
      listing_id: item.id,
      quantity: item.quantity
    }));

    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/orders', { shop_id: shopId, items });
      localStorage.removeItem('cart');
      navigate(`/orders/${response.data.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-extrabold">Checkout Order</h1>
      {error && <p className="p-3 bg-red-500/10 text-red-500 rounded-lg text-sm">{error}</p>}
      <p className="text-sm opacity-70">Confirm your details to dispatch order for consensus verification.</p>
      <button 
        onClick={handlePlaceOrder}
        disabled={loading}
        className="w-full py-3 bg-[var(--accent)] text-white font-semibold rounded-xl shadow-md disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Confirm & Place Order'}
      </button>
    </div>
  );
}