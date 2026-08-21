## TrustRoute Complete Development & Implementation Plan

---

### Phase 1: Database & Backend Foundation

* **Database Schema Deployment:** Finalize and verify the PostgreSQL schema (18 tables including users, shops, listings, orders, order_items, messages, disputes, wallets, wallet_transactions, reviews, etc.) ensuring all check constraints, foreign keys, and indexes are active.
* **Eloquent Models Configuration:** Ensure all backend models in `backend/app/Models/` (such as `User`, `Shop`, `Listing`, `Order`, `Wallet`, `Dispute`, `Message`) have precise relationship definitions (`hasMany`, `belongsTo`, `hasOne`) and mass-assignment protection (`$fillable`).
* **Service Layer Implementation:** Solidify core business logic within `backend/app/Services/`:
* `WalletService.php`: Manage active vs. locked balances, safe deposits, withdrawals, and ledger tracking.
* `OrderService.php`: Handle the 2PC (Two-Phase Commit) escrow workflow, state transitions, and automatic stock adjustments.



---

### Phase 2: API Endpoints & Controller Logic

* **Authentication & RBAC (`AuthController.php`):**
* Implement secure registration (`RegisterRequest`) and login (`LoginRequest`) using Laravel Sanctum.
* Enforce role checks for `customer`, `shopkeeper`, `delivery`, and `admin`.


* **Marketplace & Inventory API (`ShopController.php`, `ListingController.php`):**
* Enable shop creation and status management (`StoreShopRequest`, `UpdateShopRequest`).
* Provide product filtering, search, and stock management endpoints (`StoreListingRequest`).


* **Orders & Escrow API (`OrderController.php`):**
* Build secure checkout flows handling payments, locking funds via wallet service, and generating `escrow_tx_hash`.
* Manage order status lifecycles from `pending` through `completed` or `disputed`.


* **Communication & Dispute Management (`MessageController.php`, `DisputeController.php`):**
* Support real-time or polled contextual messaging linked to orders/listings with file attachment handling.
* Enable users to raise disputes and admins to arbitrate using `admin_notes` and settlement triggers.



---

### Phase 3: Frontend Architecture & State Management

* **API Integration Layer (`frontend/src/api/axios.js` & `services/api.js`):** Configure Axios interceptors for automatic Bearer token attachment, global error handling, and Sanctum CSRF protection.
* **Context Providers (`frontend/src/context/`):**
* `AuthContext.jsx`: Handle global user session state, login/logout actions, and role-based permissions.
* `ThemeContext.jsx`: Manage dark/light mode preferences utilizing the design system styles.


* **Routing & Layouts (`frontend/src/routes/`):**
* Implement `AppRoutes.jsx` with guarded routes (`ProtectedRoute.jsx`) to restrict views by user role.
* Establish structural layouts (`AuthLayout.jsx`, `DashboardLayout.jsx`, `PageLayout.jsx`).



---

### Phase 4: Feature-Specific Views & Dashboards

* **Public Marketplace (`LandingPage.jsx`, `MarketplacePage.jsx`, `ListingDetailPage.jsx`):**
* Build responsive product grids (`ProductGrid.jsx`), filter sidebars (`FilterSidebar.jsx`), and detailed product view components.


* **Cart & Checkout Flow (`CartPage.jsx`, `CheckoutPage.jsx`):**
* Implement client-side cart storage (`cartStorage.js`) and seamless transition to escrow payment processing.


* **Role-Based Dashboards (`frontend/src/pages/views/`):**
* **Customer Dashboard:** Track active orders, view wallet balances, and access dispute resolution portals.
* **Shopkeeper Dashboard:** Manage store profiles, inventory listings, and incoming order fulfillment requests.
* **Delivery Dashboard:** Monitor assigned dispatches and update delivery statuses.
* **Admin Dashboard:** Oversee platform analytics, moderate shop approvals, arbitrate disputes, and manage user account states.


* **Interactive Chat & Wallet Pages (`ChatPage.jsx`, `WalletPage.jsx`):**
* Provide contextual commerce chat interfacing with order requests and payment proofs.
* Display comprehensive transaction histories and secure balance overviews.



---

### Phase 5: Testing, Security & Deployment

* **Feature & Unit Testing:** Write comprehensive test suites for critical financial flows (escrow locking, releasing, and refunds) and role-based authorization rules.
* **Security Auditing:** Validate input sanitization, protect against SQL injection and XSS vulnerabilities, and ensure secure handling of binary image data and file attachments.
* **Production Deployment:** Prepare environment configuration files, run database migrations, build frontend assets via Vite, and launch services using process managers or containerized run scripts (`run.sh`).


Based on an analysis of your provided file maps, directory listings, and core structure for **TrustRoute**, here is a comprehensive review, structural note, and identification of potential errors/gaps to watch out for as you continue building.

---

### 1. Structural Analysis & Notes

* **Clean Separation of Concerns:** Your backend follows a solid modular separation using Laravel standards (`app/Http/Controllers/Api/`, `app/Models/`, `app/Requests/`, `app/Services/`), and your frontend relies on a clean, scalable component and view split under `src/components/`, `src/pages/views/`, and `src/context/`.
* **Role-Based Views Setup:** You have distinct views cleanly mapped for different platform participants (`AdminDashboardView.jsx`, `CustomerDashboardView.jsx`, `ShopkeeperDashboardView.jsx`, `DeliveryDashboardDashboard.jsx`), matching your database's `customer`, `shopkeeper`, `delivery`, and `admin` RBAC constraints.
* **Financial & Escrow Readiness:** Your backend includes explicit service classes (`OrderService.php` and `WalletService.php`), which are critical for orchestrating the Two-Phase Commit (2PC) escrow workflow and locking funds safely inside the `wallets` table.

---

### 2. Potential Errors, Gaps, and Things to Fix

* **Typo in Component Filename:**
* `src/pages/views/DeliveryDashboardDashboard.jsx` has a duplicate word ("DashboardDashboard"). This could cause import mismatches or path routing issues if other files reference it under a different name. It should be renamed to `DeliveryDashboardView.jsx` or `DeliveryDashboard.jsx`.


* **API Service Wiring Gaps:**
* Ensure your `src/services/api.js` and `src/api/axios.js` properly attach the Laravel Sanctum CSRF cookie and Bearer tokens. Without proper interceptors, protected endpoints in controllers like `WalletController.php` or `DisputeController.php` will return `401 Unauthorized` responses.


* **Binary Image Handling in Listings:**
* Your database schema defines `image_data BYTEA` and `image_mime_type VARCHAR(255)` inside the `listings` table. Make sure your `ListingController.php` and `StoreListingRequest.php` properly convert uploaded multipart image files into raw binary streams (`base64_decode` or file stream reading) before storing them, and serve them back with correct content-type headers.


* **Order & Escrow State Sync:**
* Ensure that when an order status shifts to `disputed` or `cancelled`, the `OrderService` handles the rollback of the `locked_balance` back to the customer's active wallet balance securely within a database transaction block (`DB::transaction`) to avoid ledger drift.
