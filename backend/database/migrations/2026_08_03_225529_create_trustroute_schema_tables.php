<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::unprepared("
            -- 1. USERS TABLE
            CREATE TABLE users (
                id BIGSERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                email_verified_at TIMESTAMPTZ NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'shopkeeper', 'delivery', 'admin')) DEFAULT 'customer',
                online_status BOOLEAN NOT NULL DEFAULT TRUE,
                acc_status VARCHAR(20) NOT NULL CHECK (acc_status IN ('active', 'suspended', 'banned')) DEFAULT 'active',
                public_keys TEXT NULL,
                remember_token VARCHAR(100) NULL,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX idx_user_role ON users(role);
            CREATE INDEX idx_user_status ON users(acc_status);

            -- 2. SHOPS TABLE
            CREATE TABLE shops (
                id BIGSERIAL PRIMARY KEY,
                shopkeeper_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                shop_name VARCHAR(255) NOT NULL,
                slug VARCHAR(255) UNIQUE NOT NULL,
                status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'suspended', 'pending')) DEFAULT 'active',
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX idx_shop_slug ON shops(slug);
            CREATE INDEX idx_shopkeeper ON shops(shopkeeper_id);

            -- 3. LISTINGS TABLE (With Binary Photo Storage)
            CREATE TABLE listings (
                id BIGSERIAL PRIMARY KEY,
                shop_id BIGINT NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
                title VARCHAR(255) NOT NULL,
                description TEXT NULL,
                price DECIMAL(10, 2) NOT NULL,
                stock INT NOT NULL CHECK (stock >= 0) DEFAULT 0,
                image_data BYTEA NULL, 
                image_mime_type VARCHAR(100) NULL, 
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX idx_listing_shop ON listings(shop_id);

            -- 4. ORDERS TABLE
            CREATE TABLE orders (
                id BIGSERIAL PRIMARY KEY,
                customer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                shop_id BIGINT NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
                delivery_id BIGINT NULL REFERENCES users(id) ON DELETE SET NULL,
                status VARCHAR(30) NOT NULL CHECK (status IN ('pending', 'paid', 'processing', 'dispatched', 'completed', 'cancelled', 'disputed')) DEFAULT 'pending',
                escrow_tx_hash VARCHAR(255) UNIQUE NULL,
                total_amount DECIMAL(10, 2) NOT NULL,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX idx_order_customer ON orders(customer_id);
            CREATE INDEX idx_order_shop ON orders(shop_id);
            CREATE INDEX idx_order_delivery ON orders(delivery_id);
            CREATE INDEX idx_order_status ON orders(status);

            -- 5. ORDER ITEMS TABLE
            CREATE TABLE order_items (
                id BIGSERIAL PRIMARY KEY,
                order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
                listing_id BIGINT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
                quantity INT NOT NULL CHECK (quantity > 0),
                price_at_purchase DECIMAL(10, 2) NOT NULL
            );

            CREATE INDEX idx_order_item_order ON order_items(order_id);

            -- 6. PEER NODES TABLE (P2P Network Layer)
            CREATE TABLE peer_nodes (
                id BIGSERIAL PRIMARY KEY,
                user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                node_id VARCHAR(255) UNIQUE NOT NULL,
                host VARCHAR(255) NOT NULL,
                port INT NOT NULL,
                last_seen_at TIMESTAMPTZ NULL,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX idx_peer_node_id ON peer_nodes(node_id);
            CREATE INDEX idx_peer_last_seen ON peer_nodes(last_seen_at);

            -- 7. REVIEWS TABLE (Post-Order User Reputation)
            CREATE TABLE reviews (
                id BIGSERIAL PRIMARY KEY,
                order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
                reviewer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                reviewee_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
                comment TEXT NULL,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_id);

            -- 8. LISTING COMMENTS TABLE (Product Pre-Purchase Q&A / Feedback)
            CREATE TABLE listing_comments (
                id BIGSERIAL PRIMARY KEY,
                listing_id BIGINT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
                user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                comment TEXT NOT NULL,
                rating SMALLINT NULL CHECK (rating BETWEEN 1 AND 5),
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX idx_listing_comment_listing ON listing_comments(listing_id);

            -- 9. DISPUTES TABLE (Admin Arbitration Center)
            CREATE TABLE disputes (
                id BIGSERIAL PRIMARY KEY,
                order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
                raised_by BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                accused_user_id BIGINT NULL REFERENCES users(id) ON DELETE SET NULL,
                reason TEXT NOT NULL,
                status VARCHAR(30) NOT NULL CHECK (status IN ('open', 'investigating', 'resolved_refund', 'resolved_penalize', 'closed')) DEFAULT 'open',
                admin_notes TEXT NULL,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX idx_dispute_order ON disputes(order_id);
            CREATE INDEX idx_dispute_status ON disputes(status);
            CREATE INDEX idx_dispute_accused ON disputes(accused_user_id);
        ");
    }

    public function down(): void
    {
        DB::unprepared("
            DROP TABLE IF EXISTS disputes CASCADE;
            DROP TABLE IF EXISTS listing_comments CASCADE;
            DROP TABLE IF EXISTS reviews CASCADE;
            DROP TABLE IF EXISTS peer_nodes CASCADE;
            DROP TABLE IF EXISTS order_items CASCADE;
            DROP TABLE IF EXISTS orders CASCADE;
            DROP TABLE IF EXISTS listings CASCADE;
            DROP TABLE IF EXISTS shops CASCADE;
            DROP TABLE IF EXISTS users CASCADE;
        ");
    }
};