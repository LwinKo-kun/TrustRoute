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

export const addToCartSecure = (user, listing, quantity = 1) => {
  const key = user?.id ? `cart_user_${user.id}` : 'cart';
  const cart = getCart(user);
  
  const existingIndex = cart.findIndex((item) => item.id === listing.id);
  
  if (existingIndex > -1) {
    const newQuantity = cart[existingIndex].quantity + quantity;
    if (newQuantity > listing.stock) {
      console.warn(`Cannot add more than available stock (${listing.stock})`);
      return false; 
    }
    cart[existingIndex].quantity = newQuantity;
  } else {
    if (quantity > listing.stock) return false;
    
    cart.push({
      ...listing,
      price: Number(listing.price) || 0,
      quantity: quantity,
    });
  }

  localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), items: cart }));
  window.dispatchEvent(new Event('cartUpdated'));
  return true;
};