// src/utils/cartStorage.js

<<<<<<< HEAD
export const getCart = (user = null) => {
  try {
    const key = user?.id ? `cart_user_${user.id}` : 'cart';
    const raw = localStorage.getItem(key) || localStorage.getItem('cart');
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.items)) {
      return parsed.items;
    }
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to parse cart storage:', err);
    return [];
  }
=======
const CART_EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 Hours in milliseconds

// Generate dynamic key per logged-in user account
export const getCartKey = (user) => {
  if (user && user.id) {
    return `cart_user_${user.id}`;
  }
  return 'cart_guest';
};

// Retrieve active cart items (filters out items older than 24 hours)
export const getCart = (user) => {
  const key = getCartKey(user);
  const data = localStorage.getItem(key);

  if (!data) return [];

  try {
    const parsed = JSON.parse(data);
    const now = Date.now();

    // Check expiration timestamp
    if (parsed.timestamp && now - parsed.timestamp > CART_EXPIRATION_MS) {
      localStorage.removeItem(key);
      return [];
    }

    return Array.isArray(parsed.items) ? parsed.items : [];
  } catch (err) {
    console.error('Error parsing cart from storage', err);
    return [];
  }
};

// Save updated cart items with fresh timestamp
export const saveCart = (user, items) => {
  const key = getCartKey(user);
  const payload = {
    timestamp: Date.now(),
    items: items,
  };
  localStorage.setItem(key, JSON.stringify(payload));

  // Dispatch custom event so Header badge updates instantly across components
  window.dispatchEvent(new Event('cartUpdated'));
>>>>>>> 6ec9421 ( every thing recovered and change matching design using same nav bar (header) for multipages)
};