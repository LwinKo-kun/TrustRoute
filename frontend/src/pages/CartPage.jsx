import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCart } from '../utils/cartStorage';
import PageLayout from '../layouts/PageLayout';

export default function CartPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  const loadCart = () => {
    setCartItems(getCart(user));
  };

  useEffect(() => {
    loadCart();
    window.addEventListener('cartUpdated', loadCart);
    return () => window.removeEventListener('cartUpdated', loadCart);
  }, [user]);

  const saveCartState = (newCart) => {
    const key = user?.id ? `cart_user_${user.id}` : 'cart';
    localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), items: newCart }));
    setCartItems(newCart);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const updateQuantity = (index, delta) => {
    const newCart = [...cartItems];
    newCart[index].quantity += delta;
    if (newCart[index].quantity < 1) newCart[index].quantity = 1;
    saveCartState(newCart);
  };

  const removeItem = (index) => {
    const newCart = cartItems.filter((_, i) => i !== index);
    saveCartState(newCart);
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

  if (cartItems.length === 0) {
    return (
      <PageLayout>
        <div className="max-w-4xl mx-auto p-12 text-center flex flex-col items-center justify-center min-h-[50vh]">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Your Cart is Empty</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 mb-8">
            Looks like you haven't added any items to your cart yet. Browse the marketplace to find great products.
          </p>
          <Link to="/dashboard" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition">
            Browse Marketplace
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto p-6 md:p-10 flex flex-col lg:flex-row gap-10">
        <div className="flex-1 flex flex-col gap-6">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Shopping Cart</h1>
          
          <div className="flex flex-col gap-4">
            {cartItems.map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex flex-col sm:flex-row items-center gap-6 p-4 border border-slate-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#0d1326] shadow-sm">
                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden shrink-0">
                  <img src={`/api/listings/${item.id}/image`} alt={item.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
                
                <div className="flex-1 flex flex-col gap-1 w-full text-center sm:text-left">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">{item.title}</h3>
                  <span className="text-xs font-semibold text-blue-600 dark:text-cyan-400 uppercase tracking-wider">
                    {item.shop?.shop_name || 'Store'}
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white mt-2">MMK {item.price}</p>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center border border-slate-200 dark:border-white/10 rounded-lg overflow-hidden bg-slate-50 dark:bg-[#0d1326]">
                    <button onClick={() => updateQuantity(index, -1)} className="px-3 py-1.5 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-white/10">-</button>
                    <span className="px-3 py-1.5 text-sm font-semibold text-slate-900 dark:text-white">{item.quantity}</span>
                    <button onClick={() => updateQuantity(index, 1)} className="px-3 py-1.5 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-white/10">+</button>
                  </div>
                  
                  <button onClick={() => removeItem(index)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition" title="Remove Item">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-80 shrink-0">
          <div className="p-6 border border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50 dark:bg-[#0d1326] flex flex-col gap-4 sticky top-24 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Order Summary</h2>
            
            <div className="flex justify-between items-center text-sm text-slate-600 dark:text-slate-400">
              <span>Subtotal ({cartItems.length} items)</span>
              <span className="font-semibold text-slate-900 dark:text-white">MMK {totalAmount.toFixed(2)}</span>
            </div>
            
            <hr className="border-slate-200 dark:border-white/10" />
            
            <div className="flex justify-between items-center text-lg">
              <span className="font-bold text-slate-900 dark:text-white">Total</span>
              <span className="font-extrabold text-blue-600 dark:text-cyan-400">MMK {totalAmount.toFixed(2)}</span>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-gradient-to-r dark:from-blue-600 dark:to-cyan-500 text-white font-bold rounded-xl shadow-md transition"
            >
              Proceed to Checkout
            </button>
            
            <Link to="/dashboard" className="text-center text-sm text-blue-600 dark:text-cyan-400 hover:underline mt-2 font-medium">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}