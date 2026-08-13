// src/utils/cartStorage.js

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
};