# 🛡️ TrustRoute

**TrustRoute** is an escrow-based online marketplace designed to make online shopping safer and more trustworthy[cite: 2].

It connects **customers, shopkeepers, delivery personnel, and administrators** in one platform[cite: 2].

Customers can browse products, place orders, make payments, track deliveries, and receive refunds when valid disputes are resolved[cite: 2]. Customer payments remain in a **locked balance** until the order is completed[cite: 2].

> **Status:** Under Development[cite: 2]

---

## ✨ Features

* User registration and login[cite: 2]
* Role-based access control[cite: 2]
* Customer, shopkeeper, delivery, and admin dashboards[cite: 2]
* Shop management[cite: 2]
* Product and inventory management[cite: 2]
* Shopping cart and checkout[cite: 2]
* Order management and tracking[cite: 2]
* Wallet system[cite: 2]
* Escrow-style payments[cite: 2]
* Delivery management[cite: 2]
* Dispute and refund management[cite: 2]
* User messaging[cite: 2]
* Product and shop reviews[cite: 2]

---

## 👥 User Roles

### 🛒 Customer

Customers can:

* Register and log in[cite: 2]
* Browse shops and products[cite: 2]
* Add products to a cart[cite: 2]
* Place orders[cite: 2]
* Pay for orders[cite: 2]
* Track deliveries[cite: 2]
* Manage their wallet[cite: 2]
* Create disputes[cite: 2]
* Send messages[cite: 2]
* Review completed orders[cite: 2]

### 🏪 Shopkeeper

Shopkeepers can:

* Create and manage shops[cite: 2]
* Add and manage products[cite: 2]
* Manage inventory[cite: 2]
* View and process orders[cite: 2]
* Receive payments after order completion[cite: 2]
* View reviews[cite: 2]

### 🚚 Delivery Personnel

Delivery personnel can:

* View assigned deliveries[cite: 2]
* Pick up orders[cite: 2]
* Update delivery status[cite: 2]
* Manage delivery tasks[cite: 2]
* Confirm deliveries[cite: 2]

### 👨‍💼 Administrator

Administrators can:

* Manage users[cite: 2]
* Manage shops[cite: 2]
* Monitor orders[cite: 2]
* Monitor transactions[cite: 2]
* Handle disputes[cite: 2]
* Process refunds[cite: 2]
* Manage the platform[cite: 2]

---

# 💰 Escrow Payment

The main financial concept of TrustRoute is to **protect customer payments until an order is successfully completed**[cite: 2].

```text
Customer Wallet
      │
      ▼
    Payment
      │
      ▼
 Locked Balance
      │
      ▼
Order Processing
      │
      ▼
   Delivery
      │
      ▼
Order Completed
      │
      ▼
Shopkeeper Wallet
```

### Payment Process

1. Customer pays for an order[cite: 2].
2. The payment is moved to a locked balance[cite: 2].
3. The shopkeeper processes the order[cite: 2].
4. The order is delivered[cite: 2].
5. The order is completed[cite: 2].
6. The payment is released to the shopkeeper[cite: 2].

If a problem occurs, the payment can remain locked while the dispute is reviewed[cite: 2].

---

# 📦 Order Flow

```text
Customer
   │
   ▼
Browse Products
   │
   ▼
Add to Cart
   │
   ▼
Checkout
   │
   ▼
Create Order
   │
   ▼
Payment Locked
   │
   ▼
Shop Processes Order
   │
   ▼
Delivery
   │
   ▼
Customer Receives Order
   │
   ▼
Order Completed
   │
   ▼
Payment Released
```

### Order Status

```text
pending
   ↓
paid
   ↓
processing
   ↓
dispatched
   ↓
completed
```

Other possible states:

```text
cancelled
cancellation_requested
disputed
```

---

# 🏪 Marketplace

Shopkeepers can create shops and sell products through the marketplace[cite: 2].

### Shop

A shop contains information such as:

* Shop name[cite: 1, 2]
* Description[cite: 1, 2]
* Shopkeeper / Owner[cite: 1, 2]
* Slug identifier[cite: 1]
* Payment credentials (e.g., KBZPay / kpay_number)[cite: 1]
* Shop status (`pending`, `active`, `suspended`)[cite: 1]

### Product / Listing

A listing contains:

* Title[cite: 1]
* Description[cite: 1, 2]
* Price[cite: 1, 2]
* Stock quantity[cite: 1, 2]
* Image binary data and MIME type[cite: 1]

---

# 🛒 Shopping Cart & Wishlist

Customers can manage items before placing an order:

* Save items to wishlist (`user_wishlists`) with personalized notes[cite: 1]
* Create orders with multiple order items (`order_items`) recording price at purchase[cite: 1]

---

# 🚚 Delivery

After an order is placed and processed, it can be assigned to delivery personnel[cite: 1, 2].

```text
Order Ready
    │
    ▼
Delivery Assigned
    │
    ▼
Picked Up
    │
    ▼
Dispatched
    │
    ▼
Completed & Approved
```

Multi-party sign-offs are logged in `order_approvals` to track status verifications and roles[cite: 1].

---

# ⚖️ Disputes

Users can raise disputes regarding orders[cite: 1, 2].

* Registered against an order (`order_id`)[cite: 1]
* Identifies the raising party (`raised_by`) and the accused party (`accused_user_id`)[cite: 1]
* Dispute statuses: `open`, `investigating`, `resolved_refund`, `resolved_penalize`, `closed`[cite: 1]
* Tracks resolution notes directly via `admin_notes`[cite: 1]

---

# 💬 Messaging & Reviews

TrustRoute supports direct messaging and transactional transparency:

* **Direct Messages**: Sent between users, with support for types (`text`, `order_request`, `payment_proof`, `system_alert`), optional attachments, and references to specific `order_id` or `listing_id`[cite: 1].
* **Order Reviews**: Bilateral ratings (1–5) and feedback submitted between reviewer and reviewee after order execution[cite: 1].
* **Listing Comments**: Public product comments and star ratings (1–5) directly on listings[cite: 1].

---

# 🏗️ System Architecture

TrustRoute uses a separate **React frontend** and **Laravel REST API backend**[cite: 2].

```text
┌─────────────────────────┐
│      React Frontend     │
│                         │
│  React + Vite           │
│  TailwindCSS            │
│  React Router           │
│  Axios                  │
└────────────┬────────────┘
             │
             │ REST API
             ▼
┌─────────────────────────┐
│     Laravel Backend     │
│                         │
│  Laravel 11             │
│  PHP 8.2+               │
│  Laravel Sanctum         │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│       PostgreSQL        │
└─────────────────────────┘
```

---

# 💻 Technology Stack

| Component      | Technology      |
| -------------- | --------------- |
| Frontend       | React 18[cite: 2]        |
| Build Tool     | Vite[cite: 2]            |
| Styling        | TailwindCSS[cite: 2]     |
| Routing        | React Router[cite: 2]    |
| HTTP Client    | Axios[cite: 2]           |
| Backend        | Laravel 11[cite: 2]      |
| Language       | PHP 8.2+[cite: 2]        |
| Authentication | Laravel Sanctum[cite: 2] |
| Database       | PostgreSQL[cite: 2]      |
| API            | REST API[cite: 2]        |

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

TrustRoute runs on **PostgreSQL**[cite: 2].

The schema includes the following tables:

* `users`: User profiles, roles, and status[cite: 1]
* `addresses`: User shipping and billing addresses[cite: 1]
* `wallets`: User escrow balances and locked funds[cite: 1]
* `wallet_transactions`: Ledger tracking credits, debits, and escrow references[cite: 1]
* `shops`: Shopkeeper storefronts and payment accounts[cite: 1]
* `listings`: Products catalog and inventory stock[cite: 1]
* `listing_comments`: Ratings and reviews for specific listings[cite: 1]
* `user_wishlists`: Bookmarked listings per user[cite: 1]
* `orders`: Order header, delivery assignment, status, and escrow hash[cite: 1]
* `order_items`: Line items capturing listing purchase snapshots[cite: 1]
* `order_approvals`: Multi-party role confirmations on orders[cite: 1]
* `reviews`: Post-order feedback between users[cite: 1]
* `disputes`: Dispute cases raised on orders[cite: 1]
* `messages`: Direct communication and transactional notifications[cite: 1]
* `peer_nodes`: Distributed node host registry per user[cite: 1]

### Main Relationships

```text
User
 ├── Addresses
 ├── Wallet (1:1)
 ├── Shop (Shopkeeper)
 ├── Orders (Customer / Delivery)
 ├── Order Approvals
 ├── Listing Comments
 ├── User Wishlists
 ├── Reviews (Reviewer / Reviewee)
 ├── Disputes (Raised By / Accused)
 ├── Messages (Sender / Receiver)
 └── Peer Nodes

Shop
 ├── Listings
 └── Orders (Fulfilled)

Listing
 ├── Order Items
 ├── Listing Comments
 ├── User Wishlists
 └── Messages (Optional Context)

Order
 ├── Order Items
 ├── Order Approvals
 ├── Reviews
 ├── Disputes
 └── Messages (Optional Context)

Wallet
 └── Wallet Transactions
```

---

# 🗃️ ER Diagram

```mermaid
erDiagram
    users {
        bigint id PK
        varchar name
        varchar email
        timestamp email_verified_at
        varchar password
        varchar role
        boolean online_status
        varchar acc_status
        text public_keys
        varchar remember_token
        timestamp created_at
        timestamp updated_at
    }

    wallets {
        bigint id PK
        bigint user_id FK
        numeric balance
        numeric locked_balance
        timestamp created_at
        timestamp updated_at
    }

    wallet_transactions {
        bigint id PK
        bigint wallet_id FK
        varchar type
        numeric amount
        varchar reference_type
        bigint reference_id
        varchar status
        text description
        timestamp created_at
        timestamp updated_at
    }

    addresses {
        bigint id PK
        bigint user_id FK
        varchar title
        varchar recipient_name
        varchar phone
        text street_address
        varchar city
        varchar postal_code
        boolean is_default
        timestamp created_at
        timestamp updated_at
    }

    shops {
        bigint id PK
        bigint shopkeeper_id FK
        varchar shop_name
        varchar slug
        varchar status
        text description
        varchar kpay_number
        timestamp created_at
        timestamp updated_at
    }

    listings {
        bigint id PK
        bigint shop_id FK
        varchar title
        text description
        numeric price
        integer stock
        bytea image_data
        varchar image_mime_type
        timestamp created_at
        timestamp updated_at
    }

    listing_comments {
        bigint id PK
        bigint listing_id FK
        bigint user_id FK
        text comment
        smallint rating
        timestamp created_at
        timestamp updated_at
    }

    user_wishlists {
        bigint id PK
        bigint user_id FK
        bigint listing_id FK
        text notes
        timestamp created_at
    }

    orders {
        bigint id PK
        bigint customer_id FK
        bigint shop_id FK
        bigint delivery_id FK
        varchar status
        varchar escrow_tx_hash
        numeric total_amount
        timestamp created_at
        timestamp updated_at
    }

    order_items {
        bigint id PK
        bigint order_id FK
        bigint listing_id FK
        integer quantity
        numeric price_at_purchase
        timestamp created_at
        timestamp updated_at
    }

    order_approvals {
        bigint id PK
        bigint order_id FK
        bigint approved_by FK
        varchar role
        timestamp approved_at
        timestamp created_at
        timestamp updated_at
    }

    reviews {
        bigint id PK
        bigint order_id FK
        bigint reviewer_id FK
        bigint reviewee_id FK
        smallint rating
        text comment
        timestamp created_at
        timestamp updated_at
    }

    disputes {
        bigint id PK
        bigint order_id FK
        bigint raised_by FK
        bigint accused_user_id FK
        text reason
        varchar status
        text admin_notes
        timestamp created_at
        timestamp updated_at
    }

    messages {
        bigint id PK
        bigint sender_id FK
        bigint receiver_id FK
        text message
        boolean is_read
        timestamp created_at
        timestamp updated_at
        varchar type
        bigint order_id FK
        bigint listing_id FK
        varchar attachment_path
    }

    peer_nodes {
        bigint id PK
        bigint user_id FK
        varchar node_id UK
        varchar host
        integer port
        timestamp last_seen_at
        timestamp created_at
        timestamp updated_at
    }

    %% User Relationships
    users ||--o{ addresses : "has"
    users ||--o{ wallets : "owns"
    users ||--o{ shops : "runs"
    users ||--o{ orders : "places (customer)"
    users ||--o{ orders : "ships (delivery)"
    users ||--o{ order_approvals : "approves"
    users ||--o{ listing_comments : "writes"
    users ||--o{ user_wishlists : "saves"
    users ||--o{ reviews : "creates (reviewer)"
    users ||--o{ reviews : "receives (reviewee)"
    users ||--o{ disputes : "raises"
    users ||--o{ disputes : "accused_in"
    users ||--o{ messages : "sends"
    users ||--o{ messages : "receives"
    users ||--o{ peer_nodes : "operates"

    %% Wallet Relationships
    wallets ||--o{ wallet_transactions : "contains"

    %% Shop & Listing Relationships
    shops ||--o{ listings : "publishes"
    shops ||--o{ orders : "receives"

    listings ||--o{ order_items : "sold_via"
    listings ||--o{ listing_comments : "receives"
    listings ||--o{ user_wishlists : "bookmarked_in"
    listings ||--o{ messages : "referenced_in"

    %% Order Relationships
    orders ||--o{ order_items : "consists_of"
    orders ||--o{ order_approvals : "validated_by"
    orders ||--o{ reviews : "reviewed_in"
    orders ||--o{ disputes : "subject_to"
    orders ||--o{ messages : "tagged_in"
```

---

# 🔐 Authentication

TrustRoute uses **Laravel Sanctum** for API authentication[cite: 2].

Authentication provides:

* Registration[cite: 2]
* Login[cite: 2]
* Logout[cite: 2]
* Protected API access via Bearer tokens[cite: 2]
* Role-based authorization (`customer`, `shopkeeper`, `delivery`, `admin`)[cite: 1, 2]

---

# 🔌 REST API

The React frontend communicates with Laravel through REST APIs[cite: 2].

Main API endpoints:

```text
/api/auth
/api/users
/api/addresses
/api/shops
/api/listings
/api/wishlist
/api/orders
/api/order-approvals
/api/wallet
/api/disputes
/api/messages
/api/reviews
```

---

# 🚀 Installation

## Requirements

Install:

* PHP 8.2+[cite: 2]
* Composer[cite: 2]
* Node.js 18+[cite: 2]
* npm[cite: 2]
* PostgreSQL[cite: 2]
* Git[cite: 2]

Check the installed versions[cite: 2]:

```bash
php --version
composer --version
node --version
npm --version
psql --version
```

---

## 1. Clone the Repository

```bash
git clone <repository-url>
cd TrustRoute
```

---

## 2. Setup Backend

```bash
cd backend
composer install
```

Create the environment file[cite: 2]:

```bash
cp .env.example .env
```

Generate the application key[cite: 2]:

```bash
php artisan key:generate
```

---

## 3. Configure PostgreSQL

Create a database named:

```text
trustroute
```

Update `backend/.env`[cite: 2]:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=trustroute
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

Run migrations[cite: 2]:

```bash
php artisan migrate
```

If seeders are available[cite: 2]:

```bash
php artisan migrate --seed
```

---

## 4. Start Backend

From the `backend` directory[cite: 2]:

```bash
php artisan serve
```

Default address[cite: 2]:

```text
[http://127.0.0.1:8000](http://127.0.0.1:8000)
```

---

## 5. Setup Frontend

Open another terminal[cite: 2]:

```bash
cd frontend
npm install
```

Start the development server[cite: 2]:

```bash
npm run dev
```

Default address[cite: 2]:

```text
http://localhost:5173
```

---

# 🧪 Development Commands

## Backend

Start Laravel[cite: 2]:

```bash
php artisan serve
```

Run migrations[cite: 2]:

```bash
php artisan migrate
```

Reset database[cite: 2]:

```bash
php artisan migrate:fresh
```

Reset and seed[cite: 2]:

```bash
php artisan migrate:fresh --seed
```

Run tests[cite: 2]:

```bash
php artisan test
```

## Frontend

Start development server[cite: 2]:

```bash
npm run dev
```

Build for production[cite: 2]:

```bash
npm run build
```

Preview production build[cite: 2]:

```bash
npm run preview
```

---

# 🔒 Security

* Password hashing[cite: 2]
* Token authentication via Laravel Sanctum[cite: 2]
* Role-based authorization[cite: 2]
* Server-side input and payload validation[cite: 2]
* Protected REST API routes[cite: 2]
* Atomic database transactions for wallet operations[cite: 2]
* Secure environment variable storage[cite: 2]

---

# 📊 System Diagrams

## 1. Use Case Diagram

```mermaid
flowchart LR

    Customer("<img src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI1MCIgdmlld0JveD0iMCAwIDQwIDUwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjEwIiByPSI3IiBmaWxsPSJub25lIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiLz48bGluZSB4MT0iMjAiIHkxPSIxNyIgeDI9IjIwIiB5Mj0iMzQiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMiIvPjxsaW5lIHgxPSI2IiB5MT0iMjQiIHgyPSIzNCIgeTI9IjI0IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiLz48bGluZSB4MT0iMjAiIHkxPSIzNCIgeDI9IjEwIiB5Mj0iNDgiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMiIvPjxsaW5lIHgxPSIyMCIgeTE9IjM0IiB4Mj0iMzAiIHkyPSI0OCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+' width='36'/><br/><b>Customer</b>")
    
    Shopkeeper("<img src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI1MCIgdmlld0JveD0iMCAwIDQwIDUwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjEwIiByPSI3IiBmaWxsPSJub25lIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiLz48bGluZSB4MT0iMjAiIHkxPSIxNyIgeDI9IjIwIiB5Mj0iMzQiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMiIvPjxsaW5lIHgxPSI2IiB5MT0iMjQiIHgyPSIzNCIgeTI9IjI0IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiLz48bGluZSB4MT0iMjAiIHkxPSIzNCIgeDI9IjEwIiB5Mj0iNDgiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMiIvPjxsaW5lIHgxPSIyMCIgeTE9IjM0IiB4Mj0iMzAiIHkyPSI0OCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+' width='36'/><br/><b>Shopkeeper</b>")
    
    Delivery("<img src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI1MCIgdmlld0JveD0iMCAwIDQwIDUwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjEwIiByPSI3IiBmaWxsPSJub25lIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiLz48bGluZSB4MT0iMjAiIHkxPSIxNyIgeDI9IjIwIiB5Mj0iMzQiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMiIvPjxsaW5lIHgxPSI2IiB5MT0iMjQiIHgyPSIzNCIgeTI9IjI0IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiLz48bGluZSB4MT0iMjAiIHkxPSIzNCIgeDI9IjEwIiB5Mj0iNDgiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMiIvPjxsaW5lIHgxPSIyMCIgeTE9IjM0IiB4Mj0iMzAiIHkyPSI0OCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+' width='36'/><br/><b>Delivery</b>")
    
    Admin("<img src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI1MCIgdmlld0JveD0iMCAwIDQwIDUwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjEwIiByPSI3IiBmaWxsPSJub25lIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiLz48bGluZSB4MT0iMjAiIHkxPSIxNyIgeDI9IjIwIiB5Mj0iMzQiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMiIvPjxsaW5lIHgxPSI2IiB5MT0iMjQiIHgyPSIzNCIgeTI9IjI0IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiLz48bGluZSB4MT0iMjAiIHkxPSIzNCIgeDI9IjEwIiB5Mj0iNDgiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMiIvPjxsaW5lIHgxPSIyMCIgeTE9IjM0IiB4Mj0iMzAiIHkyPSI0OCIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+' width='36'/><br/><b>Admin</b>")

    subgraph TrustRoute["TrustRoute System"]
        UC_Register(["Register / Login"])
        UC_Address(["Manage Addresses"])
        UC_Wallet(["Deposit / View Wallet"])
        UC_Shop(["Manage Shop & Listings"])
        UC_Browse(["Browse & Review Listings"])
        UC_Wishlist(["Save to Wishlist"])
        UC_Order(["Place Order"])
        UC_Escrow(["Lock Escrow Funds"])
        UC_Process(["Process / Dispatch Order"])
        UC_Approve(["Multi-Role Order Approval"])
        UC_Delivery(["Confirm Delivery"])
        UC_Message(["Send Direct Message"])
        UC_Dispute(["Raise Dispute"])
        UC_Resolve(["Resolve Dispute & Refund"])
        UC_Nodes(["Manage Peer Nodes"])
    end

    Customer --- UC_Register
    Customer --- UC_Address
    Customer --- UC_Wallet
    Customer --- UC_Browse
    Customer --- UC_Wishlist
    Customer --- UC_Order
    Customer --- UC_Approve
    Customer --- UC_Message
    Customer --- UC_Dispute

    Shopkeeper --- UC_Register
    Shopkeeper --- UC_Shop
    Shopkeeper --- UC_Process
    Shopkeeper --- UC_Approve
    Shopkeeper --- UC_Message
    Shopkeeper --- UC_Dispute

    Delivery --- UC_Register
    Delivery --- UC_Delivery
    Delivery --- UC_Approve
    Delivery --- UC_Message

    Admin --- UC_Resolve
    Admin --- UC_Nodes

    UC_Order -.->|include| UC_Escrow

    classDef actorNode fill:none,stroke:none;
    class Customer,Shopkeeper,Delivery,Admin actorNode;
```

---

## 2. Class Diagram

```mermaid
classDiagram
    direction TB

    class User {
        +bigint id
        +string name
        +string email
        +string role
        +string acc_status
        +boolean online_status
        +string public_keys
        +register(): boolean
        +login(): boolean
        +updateStatus(status: string): void
    }

    class Wallet {
        +bigint id
        +bigint user_id
        +numeric balance
        +numeric locked_balance
        +deposit(amount: numeric): boolean
        +lockFunds(amount: numeric): boolean
        +releaseFunds(amount: numeric): void
    }

    class WalletTransaction {
        +bigint id
        +bigint wallet_id
        +string type
        +numeric amount
        +string status
        +string reference_type
        +bigint reference_id
    }

    class Address {
        +bigint id
        +bigint user_id
        +string title
        +string recipient_name
        +string phone
        +string street_address
        +string city
        +string postal_code
        +boolean is_default
    }

    class Shop {
        +bigint id
        +bigint shopkeeper_id
        +string shop_name
        +string slug
        +string status
        +string kpay_number
    }

    class Listing {
        +bigint id
        +bigint shop_id
        +string title
        +numeric price
        +int stock
        +bytea image_data
        +updateStock(qty: int): void
    }

    class ListingComment {
        +bigint id
        +bigint listing_id
        +bigint user_id
        +string comment
        +smallint rating
    }

    class UserWishlist {
        +bigint id
        +bigint user_id
        +bigint listing_id
        +string notes
    }

    class Order {
        +bigint id
        +bigint customer_id
        +bigint shop_id
        +bigint delivery_id
        +string status
        +string escrow_tx_hash
        +numeric total_amount
        +updateOrderStatus(status: string): void
    }

    class OrderItem {
        +bigint id
        +bigint order_id
        +bigint listing_id
        +int quantity
        +numeric price_at_purchase
    }

    class OrderApproval {
        +bigint id
        +bigint order_id
        +bigint approved_by
        +string role
        +timestamp approved_at
    }

    class Review {
        +bigint id
        +bigint order_id
        +bigint reviewer_id
        +bigint reviewee_id
        +smallint rating
        +string comment
    }

    class Dispute {
        +bigint id
        +bigint order_id
        +bigint raised_by
        +bigint accused_user_id
        +string reason
        +string status
        +string admin_notes
    }

    class Message {
        +bigint id
        +bigint sender_id
        +bigint receiver_id
        +string message
        +string type
        +bigint order_id
        +bigint listing_id
        +string attachment_path
    }

    class PeerNode {
        +bigint id
        +bigint user_id
        +string node_id
        +string host
        +int port
        +timestamp last_seen_at
    }

    User "1" -- "*" Address : has
    User "1" -- "1" Wallet : owns
    User "1" -- "*" Shop : owns
    User "1" -- "*" Order : places/delivers
    User "1" -- "*" OrderApproval : approves
    User "1" -- "*" ListingComment : submits
    User "1" -- "*" UserWishlist : tracks
    User "1" -- "*" Review : writes/receives
    User "1" -- "*" Dispute : raises/accused
    User "1" -- "*" Message : sends/receives
    User "1" -- "*" PeerNode : operates

    Wallet "1" -- "*" WalletTransaction : records
    Shop "1" -- "*" Listing : publishes
    Shop "1" -- "*" Order : fulfills

    Listing "1" -- "*" OrderItem : appears_in
    Listing "1" -- "*" ListingComment : receives
    Listing "1" -- "*" UserWishlist : saved_by
    Listing "1" -- "*" Message : referenced_in

    Order "1" -- "*" OrderItem : contains
    Order "1" -- "*" OrderApproval : requires
    Order "1" -- "*" Review : produces
    Order "1" -- "*" Dispute : triggers
    Order "1" -- "*" Message : discusses
```

---

## 3. Order Checkout Sequence

```mermaid
sequenceDiagram
    autonumber

    actor Customer
    participant Frontend as React Frontend
    participant OrderCtrl as Order / Escrow Controller
    participant WalletSvc as Wallet Service
    participant DB as PostgreSQL Database
    actor Shopkeeper
    actor Delivery as Delivery Personnel

    %% -------------------------------------------------
    %% 1. ORDER CREATION & ESCROW LOCK
    %% -------------------------------------------------
    rect rgb(240, 248, 255)
        Note over Customer, DB: Phase 1: Order Placement & Escrow Fund Locking
        Customer->>Frontend: Select items & click "Checkout"
        Frontend->>OrderCtrl: POST /api/orders (items, address_id)
        
        OrderCtrl->>DB: Check listings price & stock availability
        DB-->>OrderCtrl: Stock OK, total calculated

        OrderCtrl->>WalletSvc: Verify customer wallet & lock funds
        WalletSvc->>DB: BEGIN TRANSACTION
        WalletSvc->>DB: Check balance >= total_amount
        
        alt Insufficient Balance or Stock
            WalletSvc->>DB: ROLLBACK
            WalletSvc-->>OrderCtrl: Insufficient balance / stock
            OrderCtrl-->>Frontend: Error: Order could not be processed
            Frontend-->>Customer: Show error notification
        else Sufficient Balance & Stock
            WalletSvc->>DB: Deduct balance & increment locked_balance
            WalletSvc->>DB: INSERT INTO wallet_transactions (type='escrow_lock', status='completed')[cite: 1]
            OrderCtrl->>DB: Decrement listings stock[cite: 1]
            OrderCtrl->>DB: INSERT INTO orders (status='paid', escrow_tx_hash=...)[cite: 1, 2]
            OrderCtrl->>DB: INSERT INTO order_items (quantity, price_at_purchase)[cite: 1]
            WalletSvc->>DB: COMMIT TRANSACTION
            OrderCtrl-->>Frontend: 201 Created (Order ID, Status: paid)[cite: 1]
            Frontend-->>Customer: Order placed & funds held in escrow[cite: 2]
        end
    end

    %% -------------------------------------------------
    %% 2. SHOP PROCESSING & ASSIGNMENT
    %% -------------------------------------------------
    rect rgb(245, 255, 250)
        Note over Shopkeeper, Delivery: Phase 2: Fulfillment & Delivery Handover
        OrderCtrl-->>Shopkeeper: Notification: New Paid Order[cite: 1]
        Shopkeeper->>Frontend: Accept & package order
        Frontend->>OrderCtrl: PATCH /api/orders/{id}/status (processing)[cite: 1, 2]
        OrderCtrl->>DB: UPDATE orders SET status='processing'[cite: 1]

        Shopkeeper->>Frontend: Assign delivery person
        Frontend->>OrderCtrl: PATCH /api/orders/{id}/delivery (delivery_id)[cite: 1]
        OrderCtrl->>DB: UPDATE orders SET delivery_id=...[cite: 1]

        Delivery->>Frontend: Confirm pickup & dispatch package
        Frontend->>OrderCtrl: POST /api/order-approvals (role='delivery', status='dispatched')[cite: 1]
        OrderCtrl->>DB: INSERT INTO order_approvals (role='delivery')[cite: 1]
        OrderCtrl->>DB: UPDATE orders SET status='dispatched'[cite: 1]
    end

    %% -------------------------------------------------
    %% 3. DELIVERY CONFIRMATION & ESCROW RELEASE
    %% -------------------------------------------------
    rect rgb(255, 250, 240)
        Note over Customer, Shopkeeper: Phase 3: Order Completion & Escrow Payout
        Delivery->>Customer: Deliver package to recipient address[cite: 1, 2]
        
        Customer->>Frontend: Confirm receipt & complete order[cite: 2]
        Frontend->>OrderCtrl: POST /api/order-approvals (role='customer')[cite: 1]
        
        OrderCtrl->>DB: INSERT INTO order_approvals (role='customer')[cite: 1]
        OrderCtrl->>DB: UPDATE orders SET status='completed'[cite: 1]

        OrderCtrl->>WalletSvc: Release escrow funds to Shopkeeper[cite: 2]
        WalletSvc->>DB: BEGIN TRANSACTION
        WalletSvc->>DB: Deduct locked_balance from Customer[cite: 1, 2]
        WalletSvc->>DB: Credit balance to Shopkeeper wallet[cite: 1, 2]
        WalletSvc->>DB: INSERT INTO wallet_transactions (Shopkeeper, type='escrow_release')[cite: 1]
        WalletSvc->>DB: COMMIT TRANSACTION

        OrderCtrl-->>Frontend: Order Completed & Funds Released[cite: 2]
        Frontend-->>Customer: Order Completed! Prompt to leave a review[cite: 1, 2]
        OrderCtrl-->>Shopkeeper: Funds deposited into shopkeeper wallet[cite: 2]
    end

    %% -------------------------------------------------
    %% 4. POST-COMPLETION REVIEW
    %% -------------------------------------------------
    rect rgb(250, 245, 255)
        Note over Customer, DB: Phase 4: Feedback & Rating
        Customer->>Frontend: Submit rating & comment
        Frontend->>OrderCtrl: POST /api/reviews (rating, comment, reviewee_id)[cite: 1]
        OrderCtrl->>DB: INSERT INTO reviews (order_id, reviewer_id, reviewee_id, rating)[cite: 1]
        OrderCtrl-->>Frontend: Review Saved[cite: 1]
    end
```

---

# 📄 License

This project is licensed under the **MIT License**[cite: 2].

See the `LICENSE` file for details[cite: 2].

---

# 👨‍💻 Author

**Lwin Ko**[cite: 2]

University of Computer Studies, Monywa[cite: 2]

---

## 🛡️ TrustRoute

**A marketplace designed to make online shopping safer through escrow-based payments, shop management, delivery tracking, and dispute handling.**[cite: 2]