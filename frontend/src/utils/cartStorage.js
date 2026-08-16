// src/utils/cartStorage.js

export const getCart = (user = null) => {
  try {
    const key = user?.id ? `cart_user_${user.id}` : 'cart';
    const raw = localStorage.getItem(key) || localStorage.getItem('cart');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed?.items || (Array.isArray(parsed) ? parsed : []);
  } catch (err) {
    return [];
  }
};

export const clearCart = (user = null) => {
  const key = user?.id ? `cart_user_${user.id}` : 'cart';
  localStorage.removeItem(key);
  window.dispatchEvent(new Event('cartUpdated'));
};

// NEW: Centralized Add To Cart logic
export const addToCartSecure = (user, listing, quantity = 1) => {
  const key = user?.id ? `cart_user_${user.id}` : 'cart';
  const cart = getCart(user);
  
  const existingIndex = cart.findIndex((item) => item.id === listing.id);
  
  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      ...listing,
      price: Number(listing.price) || 0,
      quantity: quantity,
    });
  }

  localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), items: cart }));
  window.dispatchEvent(new Event('cartUpdated'));
};