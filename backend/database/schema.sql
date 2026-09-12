-- Simpul Enterprise Platform MySQL Database Schema

CREATE DATABASE IF NOT EXISTS simpul_db;
USE simpul_db;

-- 1. Companies Table
CREATE TABLE IF NOT EXISTS companies (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(100),
    industry VARCHAR(100),
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    address TEXT,
    warehouse_capacity INT DEFAULT 1000,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    company_id VARCHAR(64),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('company_admin', 'courier', 'worker') NOT NULL,
    phone VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL
);

-- 3. Raw Materials Table (Accurate-style inventory)
CREATE TABLE IF NOT EXISTS raw_materials (
    id VARCHAR(64) PRIMARY KEY,
    company_id VARCHAR(64) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    stock_quantity DECIMAL(10,2) DEFAULT 0.00,
    unit_type VARCHAR(50) DEFAULT 'meter',
    unit_cost DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    reorder_point INT DEFAULT 50,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- 4. Products Table (Finished goods with piecework rates)
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    company_id VARCHAR(64) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    image_url TEXT,
    stock_quantity INT DEFAULT 0,
    piece_rate_pay DECIMAL(12,2) NOT NULL DEFAULT 0.00, -- Pay rate to remote worker per unit
    selling_price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    production_cost DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- 5. Product Materials (Bill of Materials BOM)
CREATE TABLE IF NOT EXISTS product_materials (
    id VARCHAR(64) PRIMARY KEY,
    product_id VARCHAR(64) NOT NULL,
    material_id VARCHAR(64) NOT NULL,
    quantity_required DECIMAL(10,2) NOT NULL DEFAULT 1.00,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (material_id) REFERENCES raw_materials(id) ON DELETE CASCADE
);

-- 6. Workers Table
CREATE TABLE IF NOT EXISTS workers (
    id VARCHAR(64) PRIMARY KEY,
    company_id VARCHAR(64) NOT NULL,
    user_id VARCHAR(64),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    village VARCHAR(100),
    skills VARCHAR(255),
    payout_method VARCHAR(50) DEFAULT 'GoPay',
    payout_account VARCHAR(100),
    total_earnings DECIMAL(12,2) DEFAULT 0.00,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 7. Work Orders Table (Item tracking for workers)
CREATE TABLE IF NOT EXISTS work_orders (
    id VARCHAR(64) PRIMARY KEY,
    company_id VARCHAR(64) NOT NULL,
    product_id VARCHAR(64) NOT NULL,
    worker_id VARCHAR(64),
    code VARCHAR(100) NOT NULL UNIQUE, -- Alpha-numeric ID (e.g., ORD-2026-SEW-001)
    quantity INT NOT NULL DEFAULT 1,
    piece_rate DECIMAL(12,2) NOT NULL,
    total_piece_pay DECIMAL(12,2) NOT NULL,
    start_date DATE,
    target_date DATE,
    completed_date DATE,
    status ENUM('draft', 'assigned', 'in_transit_out', 'in_production', 'in_transit_in', 'qc_passed', 'reworked', 'paid') DEFAULT 'draft',
    proof_photo_url TEXT,
    qc_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE SET NULL
);

-- 8. Deliveries Table (Courier dispatch & live tracking)
CREATE TABLE IF NOT EXISTS deliveries (
    id VARCHAR(64) PRIMARY KEY,
    company_id VARCHAR(64) NOT NULL,
    work_order_id VARCHAR(64) NOT NULL,
    courier_id VARCHAR(64),
    delivery_code VARCHAR(100) NOT NULL UNIQUE,
    type ENUM('raw_material_drop', 'finished_good_pickup') NOT NULL,
    pickup_address TEXT NOT NULL,
    destination_address TEXT NOT NULL,
    recipient_name VARCHAR(255),
    recipient_phone VARCHAR(50),
    delivery_fee DECIMAL(12,2) DEFAULT 15000.00,
    e_wallet_method VARCHAR(50) DEFAULT 'GoPay',
    status ENUM('pending', 'courier_assigned', 'picked_up', 'in_transit', 'delivered', 'failed') DEFAULT 'pending',
    proof_photo_url TEXT,
    tracking_lat DECIMAL(10,8),
    tracking_lng DECIMAL(11,8),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (work_order_id) REFERENCES work_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (courier_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 9. Payouts Table (Fintech e-wallet payouts for workers and couriers)
CREATE TABLE IF NOT EXISTS payouts (
    id VARCHAR(64) PRIMARY KEY,
    company_id VARCHAR(64) NOT NULL,
    recipient_type ENUM('worker', 'courier') NOT NULL,
    recipient_id VARCHAR(64) NOT NULL,
    recipient_name VARCHAR(255) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- GoPay, OVO, DANA, Bank Transfer
    reference_number VARCHAR(100) NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'completed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- 10. Blockchain Provenance Table (Immutable ledger SHA-256 blocks)
CREATE TABLE IF NOT EXISTS blockchain_blocks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    block_index INT NOT NULL,
    work_order_id VARCHAR(64) NOT NULL,
    item_code VARCHAR(100) NOT NULL,
    worker_name VARCHAR(255),
    product_name VARCHAR(255),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_payload JSON NOT NULL,
    previous_hash VARCHAR(64) NOT NULL,
    block_hash VARCHAR(64) NOT NULL
);
