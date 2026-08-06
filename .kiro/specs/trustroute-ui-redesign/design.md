# Design Document

## Component Architecture

```
frontend/src/components/
├── common/
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── ProductCard.jsx
│   ├── RatingStars.jsx
│   ├── Button.jsx
│   ├── Input.jsx
│   ├── Select.jsx
│   ├── ToastNotification.jsx
│   ├── Badge.jsx
│   └── Spinner.jsx
├── layout/
│   ├── Layout.jsx
│   ├── Sidebar.jsx
│   └── DashboardLayout.jsx
└── market/
    ├── ProductGrid.jsx
    ├── FilterSidebar.jsx
    ├── ProductDetails.jsx
    ├── ShopCard.jsx
    └── ShopProfile.jsx

frontend/src/pages/
├── LandingPage.jsx
├── MarketplacePage.jsx
├── ProductDetailsPage.jsx
├── ShopProfilePage.jsx
├── CartPage.jsx
├── CheckoutPage.jsx
├── OrderHistoryPage.jsx
├── CustomerDashboard.jsx
├── ShopkeeperDashboard.jsx
├── DeliveryDashboard.jsx
└── AdminDashboard.jsx
```

## Page Designs

### 1. Landing Page
- Hero section with search bar
- Featured shops
- Trending products
- Categories
- Trust signals (escrow, verified shops)

### 2. Marketplace Page
- Header with search and cart
- Filter sidebar (categories, price, rating, shop)
- Product grid with ProductCard components
- Pagination or infinite scroll

### 3. Product Details Page
- Image gallery
- Product information (title, description, price, stock)
- Rating and reviews section
- Related products
- Add to cart button

### 4. Cart & Checkout
- Cart summary with items
- Shipping/billing forms
- Payment options
- Order summary with escrow hash display
- Progress indicator

### 5. Customer Dashboard
- Stats cards (active orders, completed, pending)
- Recent orders with status tracker
- Tabs: Orders, Wishlist, Saved Addresses
- Quick links to marketplace

### 6. Shopkeeper Dashboard
- Overview metrics (sales, orders, listings)
- Product management table
- Order management table
- Analytics charts
- Add product button

### 7. Delivery Dashboard
- Active orders list
- Order status tracker
- Earnings section
- Map integration placeholder

### 8. Admin Dashboard
- Platform metrics
- User management table
- Dispute management
- System health monitor

## Color Scheme

```css
:root {
  --primary: #6366f1;      /* Indigo - Main brand color */
  --primary-dark: #4f46e5;
  --primary-light: #818cf8;
  --accent: #10b981;       /* Emerald - Trust/Security */
  --accent-dark: #059669;
  --danger: #ef4444;       /* Red - Errors, deletion */
  --warning: #f59e0b;      /* Amber - Warnings */
  --info: #3b82f6;         /* Blue - Information */
  --text: #1f2937;         /* Gray-800 */
  --text-light: #6b7280;   /* Gray-500 */
  --bg: #ffffff;
  --bg-dark: #111827;
  --border: #e5e7eb;
  --card-bg: #f9fafb;
}
```

## API Integration

```javascript
// api/market.js
export const getProducts = async (params) => {
  return await api.get('/listings', { params });
};

export const getProductById = async (id) => {
  return await api.get(`/listings/${id}`);
};

export const getShops = async () => {
  return await api.get('/shops');
};

export const createOrder = async (data) => {
  return await api.post('/orders', data);
};

export const getOrderHistory = async (params) => {
  return await api.get('/orders', { params });
};

// api/dashboard.js
export const getCustomerDashboard = async () => {
  return await api.get('/dashboard');
};

export const getShopkeeperDashboard = async () => {
  return await api.get('/dashboard');
};

export const getMyShop = async () => {
  return await api.get('/my-shop');
};
```

## Implementation Tasks

### Phase 1: Core Components
1. Create common components (Header, Footer, ProductCard, RatingStars, ToastNotification)
2. Create layout components (Layout, Sidebar)
3. Create form components (Input, Select, Button)

### Phase 2: Marketplace Pages
4. Create LandingPage
5. Create MarketplacePage with filtering
6. Create ProductDetailsPage
7. Create CartPage
8. Create CheckoutPage

### Phase 3: Dashboard Pages
9. Create CustomerDashboard
10. Create ShopkeeperDashboard
11. Create DeliveryDashboard
12. Create AdminDashboard

### Phase 4: Integration
13. Create API service files
14. Create ProtectedRoute wrapper
15. Update routing
16. Test and polish

## Design Patterns

### Product Card Design
```
┌─────────────────────────────────────┐
│           Product Image             │
│  [Shop Badge]        [Stock Badge]  │
├─────────────────────────────────────┤
│  Product Name (2 lines max)         │
│  Shop Name with ✓ verification     │
│  ⭐ 4.5 (128)  │  📦 Free shipping  │
├─────────────────────────────────────┤
│  $99.99          [Add to Cart]      │
└─────────────────────────────────────┘
```

### Header Design
```
┌─────────────────────────────────────────────────────────┐
│ Logo │ Search Bar                  │ Cart (2) │ User ▼ │
├─────────────────────────────────────────────────────────┤
│ Home  │ Shop  │ Categories  │ Help  │                    │
└─────────────────────────────────────────────────────────┘
```

### Order Status Tracker Design
```
Order Confirmed  ✓  Processing  ⏳  Shipped  ⏳  Delivered
                 [✓]              [ ]              [ ]
```