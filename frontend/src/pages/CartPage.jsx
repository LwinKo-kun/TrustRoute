import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  const removeItem = (id) => {
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold">Your Cart is Empty</h2>
        <p className="text-sm opacity-70">Explore the marketplace to add items to your cart.</p>
        <Link to="/marketplace" className="px-6 py-3 bg-[var(--accent)] text-white text-sm font-semibold rounded-xl">Browse Marketplace</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-extrabold">Shopping Cart</h1>
      <div className="flex flex-col gap-4">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center p-4 border border-[var(--border)] rounded-xl">
            <div>
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-xs opacity-70">Quantity: {item.quantity}</p>
            </div>
            <div className="flex items-center gap-6">
              <span className="font-extrabold text-[var(--accent)]">${item.price * item.quantity}</span>
              <button onClick={() => removeItem(item.id)} className="text-xs text-red-500 hover:underline">Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-[var(--border)]">
        <span className="text-lg font-bold">Total: ${totalPrice.toFixed(2)}</span>
        <button 
          onClick={() => navigate('/checkout')}
          className="px-6 py-3 bg-[var(--accent)] text-white font-semibold rounded-xl"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}