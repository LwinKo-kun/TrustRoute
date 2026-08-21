# 🛡️ TrustRoute

TrustRoute is an **escrow-based marketplace system** that connects customers, shopkeepers, delivery personnel, and administrators.

Customers can buy products from shops, pay through the platform, and track their orders. Payments are held in a **locked balance** until the order is completed.

> **Status:** Under Development

---

## ✨ Features

* User registration and login
* Role-based access
* Customer dashboard
* Shopkeeper dashboard
* Delivery dashboard
* Admin dashboard
* Shop management
* Product management
* Shopping cart
* Checkout
* Order management
* Order tracking
* Wallet system
* Escrow payment system
* Delivery management
* Dispute handling
* Refund management
* Messaging
* Reviews

---

## 👥 User Roles

### Customer

* Browse shops and products
* Add products to cart
* Place orders
* Make payments
* Track orders
* Manage wallet
* Create disputes
* Send messages
* Review orders

### Shopkeeper

* Create and manage a shop
* Add and manage products
* Manage inventory
* View customer orders
* Process orders
* Receive payments
* View reviews

### Delivery Personnel

* View assigned deliveries
* Manage delivery tasks
* Update delivery status
* Confirm deliveries

### Admin

* Manage users
* Manage shops
* Monitor orders
* Monitor transactions
* Handle disputes
* Process refunds
* Manage the platform

---

## 💰 Escrow System

TrustRoute uses an escrow-style payment system.

When a customer places an order:

```text
Customer Wallet
      ↓
Payment
      ↓
Locked Balance
      ↓
Order Processing
      ↓
Delivery
      ↓
Order Completed
      ↓
Shopkeeper Wallet
```

The payment is not immediately transferred to the shopkeeper.

It remains locked until the order is successfully completed.

If there is a problem with the order, the payment can remain locked while the dispute is reviewed.

---

## 📦 Order Flow

A normal order follows this process:

```text
Customer
   ↓
Browse Products
   ↓
Add to Cart
   ↓
Checkout
   ↓
Create Order
   ↓
Payment Locked
   ↓
Shop Processes Order
   ↓
Delivery
   ↓
Customer Receives Order
   ↓
Order Completed
   ↓
Payment Released
```

Possible order states include:

```text
Pending
Confirmed
Processing
Dispatched
Out for Delivery
Delivered
Completed
Cancelled
Disputed
Refunded
```

---

## 🏪 Marketplace

Shopkeepers can create shops and sell products through the marketplace.

A shop can contain:

* Shop name
* Description
* Owner
* Products
* Contact information
* Shop status

Products can contain:

* Product name
* Description
* Price
* Quantity
* Category
* Image
* Availability

---

## 🛒 Shopping Cart

Customers can add products to a cart before checkout.

The cart supports:

* Add product
* Remove product
* Change quantity
* View subtotal
* View total
* Checkout

Example:

```text
Product A × 2
Product B × 1
Product C × 3
----------------
Total
```

---

## 🚚 Delivery

After a shopkeeper prepares an order, it can be assigned to a delivery person.

Basic delivery flow:

```text
Order Ready
    ↓
Delivery Assigned
    ↓
Picked Up
    ↓
Out for Delivery
    ↓
Delivered
```

Delivery personnel can update the delivery status through their dashboard.

---

## ⚖️ Disputes

Customers can create a dispute when there is a problem with an order.

Examples:

* Product not received
* Wrong product
* Damaged product
* Delivery problem
* Other order problems

Basic flow:

```text
Customer
   ↓
Create Dispute
   ↓
Admin Review
   ↓
Resolution
```

The administrator can decide whether to:

* Refund the customer
* Release the payment
* Take another appropriate action

---

## 💬 Messaging

TrustRoute can provide communication between users.

Messages can be related to:

* Orders
* Shops
* Deliveries
* Payments

---

## ⭐ Reviews

Customers can review completed orders.

Reviews can include:

* Rating
* Comment
* Customer
* Shop/product
* Order
* Date

Reviews help customers evaluate shops and products.

---

# 🏗️ Architecture

TrustRoute uses a separate React frontend and Laravel backend.

```text
┌─────────────────────┐
│    React Frontend   │
│                     │
│ React + Vite        │
│ TailwindCSS         │
│ React Router        │
│ Axios               │
└──────────┬──────────┘
           │
           │ REST API
           ↓
┌─────────────────────┐
│    Laravel Backend  │
│                     │
│ Laravel 11          │
│ PHP 8.2+            │
│ Laravel Sanctum     │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│     PostgreSQL      │
└─────────────────────┘
```

---

# 💻 Technology Stack

| Component      | Technology      |
| -------------- | --------------- |
| Frontend       | React 18        |
| Build Tool     | Vite            |
| Styling        | TailwindCSS     |
| Routing        | React Router    |
| HTTP Client    | Axios           |
| Backend        | Laravel 11      |
| Language       | PHP 8.2+        |
| Authentication | Laravel Sanctum |
| Database       | PostgreSQL      |
| API            | REST API        |

---

# 📁 Project Structure

```text
TrustRoute/
│
├── backend/
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── public/
│   ├── routes/
│   ├── storage/
│   ├── tests/
│   ├── .env.example
│   └── composer.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── LICENSE
└── README.md
```

---

# 🗄️ Database

TrustRoute uses **PostgreSQL**.

The database stores information about:

* Users
* Shops
* Products
* Categories
* Inventory
* Carts
* Orders
* Order items
* Wallets
* Transactions
* Deliveries
* Disputes
* Messages
* Reviews

Basic relationship:

```text
User
 ├── Shop
 ├── Order
 ├── Wallet
 ├── Message
 └── Review

Shop
 └── Products

Order
 ├── Order Items
 ├── Payment
 ├── Delivery
 └── Dispute
```

---

# 🔐 Authentication

The backend uses **Laravel Sanctum** for authentication.

Authentication handles:

* Registration
* Login
* Logout
* Protected API access

Role-based authorization controls what each user can access.

---

# 🔌 API

The frontend communicates with the Laravel backend through REST APIs.

Main API areas include:

```text
/api/auth
/api/users
/api/shops
/api/products
/api/cart
/api/orders
/api/wallet
/api/deliveries
/api/disputes
/api/messages
/api/reviews
```

The exact API routes may change during development.

---

# 🚀 Installation

## Requirements

Install:

* PHP 8.2+
* Composer
* Node.js 18+
* npm
* PostgreSQL
* Git

Check versions:

```bash
php --version
composer --version
node --version
npm --version
psql --version
```

---

## 1. Clone Repository

```bash
git clone <repository-url>
cd TrustRoute
```

---

## 2. Backend Setup

```bash
cd backend
composer install
```

Create the environment file:

```bash
cp .env.example .env
```

Generate the Laravel key:

```bash
php artisan key:generate
```

---

## 3. Database Setup

Create a PostgreSQL database named:

```text
trustroute
```

Configure `backend/.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=trustroute
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

Run migrations:

```bash
php artisan migrate
```

If seeders are available:

```bash
php artisan migrate --seed
```

---

## 4. Start Backend

```bash
php artisan serve
```

Backend:

```text
http://127.0.0.1:8000
```

---

## 5. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🧪 Development Commands

### Backend

Start Laravel:

```bash
php artisan serve
```

Run migrations:

```bash
php artisan migrate
```

Reset database:

```bash
php artisan migrate:fresh
```

Reset and seed:

```bash
php artisan migrate:fresh --seed
```

Run tests:

```bash
php artisan test
```

### Frontend

Start development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

# 🔒 Security

TrustRoute handles user accounts and financial transactions, so the system should use:

* Password hashing
* Authentication
* Role-based authorization
* Request validation
* Protected API routes
* Database transactions
* Secure environment variables
* Proper error handling

Never commit `.env` files or database passwords to the repository.

---

# 📌 Core Transaction Rule

The main financial rule is:

```text
Customer Payment
       ↓
Locked Balance
       ↓
Order Completed
       ↓
Shopkeeper Wallet
```

The customer's payment should remain locked until the appropriate order completion or dispute resolution process is finished.

---

# 📄 License

This project is licensed under the **MIT License**.

See the `LICENSE` file for details.

---

# 👨‍💻 Author

**Lwin Ko**

University of Computer Studies, Monywa

---

## 🛡️ TrustRoute

**A marketplace with escrow-based transactions, shop management, delivery, and dispute handling.**
