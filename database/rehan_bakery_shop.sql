-- ============================================
-- REHAN BAKERY SHOP - COMPLETE DATABASE
-- ============================================

CREATE DATABASE IF NOT EXISTS rehan_bakery_shop;
USE rehan_bakery_shop;

-- Drop existing tables
DROP TABLE IF EXISTS contact_messages;
DROP TABLE IF EXISTS wishlist;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS coupons;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20),
  address TEXT,
  password VARCHAR(255) NOT NULL,
  role ENUM('customer', 'admin', 'delivery') DEFAULT 'customer',
  reset_token VARCHAR(255) NULL,
  reset_token_expiry DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image VARCHAR(255),
  category ENUM('cakes', 'breads', 'pastries', 'cookies', 'cupcakes', 'donuts') NOT NULL,
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  coupon_code VARCHAR(50) NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  delivery_charge DECIMAL(10,2) DEFAULT 0,
  final_amount DECIMAL(10,2) NOT NULL,
  payment_method ENUM('cod', 'online') DEFAULT 'cod',
  payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
  order_status ENUM('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  user_name VARCHAR(100) NOT NULL,
  rating INT NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================
-- WISHLIST TABLE
-- ============================================
CREATE TABLE wishlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_wishlist (user_id, product_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ============================================
-- COUPONS TABLE
-- ============================================
CREATE TABLE coupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  discount_type ENUM('percentage', 'fixed') NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  expiry_date DATE,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- CONTACT MESSAGES TABLE
-- ============================================
CREATE TABLE contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  message TEXT NOT NULL,
  status ENUM('unread', 'read') DEFAULT 'unread',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_wishlist_user ON wishlist(user_id);

-- ============================================
-- INSERT ADMIN USER (password: admin123)
-- ============================================
INSERT INTO users (full_name, email, phone, password, role) VALUES
('Admin User', 'admin@bakery.com', '9876543210', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('John Customer', 'john@example.com', '9876543211', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer'),
('Delivery Partner', 'delivery@bakery.com', '9876543212', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'delivery');

-- ============================================
-- INSERT SAMPLE PRODUCTS
-- ============================================
INSERT INTO products (name, description, price, image, category, stock) VALUES
('Chocolate Truffle Cake', 'Rich dark chocolate layered cake with smooth truffle ganache frosting. Perfect for chocolate lovers.', 599.00, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop', 'cakes', 15),
('Vanilla Sponge Cake', 'Light and fluffy vanilla sponge cake with fresh cream and seasonal fruits.', 449.00, 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=300&fit=crop', 'cakes', 20),
('Red Velvet Cake', 'Classic red velvet cake with rich cream cheese frosting. Elegant and delicious.', 549.00, 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=400&h=300&fit=crop', 'cakes', 12),
('Black Forest Cake', 'Traditional German cake with chocolate layers, whipped cream, and cherries.', 499.00, 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400&h=300&fit=crop', 'cakes', 18),
('Whole Wheat Bread', 'Healthy whole wheat bread, freshly baked daily. High in fiber and nutrients.', 45.00, 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=400&h=300&fit=crop', 'breads', 50),
('Garlic Bread', 'Crispy garlic bread with herbs and butter. Perfect as a side dish.', 89.00, 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=400&h=300&fit=crop', 'breads', 40),
('Multigrain Bread', 'Nutritious multigrain bread with seeds and whole grains.', 65.00, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop', 'breads', 35),
('French Baguette', 'Authentic French baguette with crispy crust and soft interior.', 55.00, 'https://images.unsplash.com/photo-1568471173242-461f0a730452?w=400&h=300&fit=crop', 'breads', 30),
('Chicken Puff', 'Flaky puff pastry filled with spiced chicken. A savory delight.', 35.00, 'https://images.unsplash.com/photo-1609339472387-f0c7c2a3ee2a?w=400&h=300&fit=crop', 'pastries', 60),
('Veg Patty', 'Crispy vegetable patty with a blend of fresh vegetables and spices.', 25.00, 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400&h=300&fit=crop', 'pastries', 55),
('Egg Puff', 'Flaky pastry with spiced egg filling. Popular breakfast item.', 30.00, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop', 'pastries', 45),
('Paneer Puff', 'Delicious puff filled with spiced cottage cheese.', 35.00, 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400&h=300&fit=crop', 'pastries', 40),
('Chocolate Chip Cookies', 'Classic cookies loaded with chocolate chips. Soft and chewy.', 149.00, 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop', 'cookies', 80),
('Butter Cookies', 'Traditional butter cookies, melt-in-your-mouth delicious.', 129.00, 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop', 'cookies', 70),
('Oatmeal Raisin Cookies', 'Healthy oatmeal cookies with plump raisins.', 139.00, 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=400&h=300&fit=crop', 'cookies', 65),
('Vanilla Cupcake', 'Soft vanilla cupcake topped with vanilla buttercream.', 49.00, 'https://images.unsplash.com/photo-1519869325930-281384150729?w=400&h=300&fit=crop', 'cupcakes', 50),
('Chocolate Cupcake', 'Rich chocolate cupcake with chocolate ganache topping.', 55.00, 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400&h=300&fit=crop', 'cupcakes', 45),
('Red Velvet Cupcake', 'Mini red velvet cupcakes with cream cheese frosting.', 59.00, 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=400&h=300&fit=crop', 'cupcakes', 40),
('Glazed Donut', 'Classic glazed donut with sweet sugar glaze.', 35.00, 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop', 'donuts', 60),
('Chocolate Donut', 'Soft donut with rich chocolate coating.', 40.00, 'https://images.unsplash.com/photo-1527904324834-3bda86da6771?w=400&h=300&fit=crop', 'donuts', 55),
('Strawberry Donut', 'Fluffy donut with strawberry glaze and sprinkles.', 40.00, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', 'donuts', 3);

-- ============================================
-- INSERT SAMPLE COUPONS
-- ============================================
INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, expiry_date, status) VALUES
('WELCOME10', 'percentage', 10.00, 200.00, '2025-12-31', 'active'),
('FLAT50', 'fixed', 50.00, 300.00, '2025-12-31', 'active'),
('SWEET20', 'percentage', 20.00, 500.00, '2025-06-30', 'active'),
('FREESHIP', 'fixed', 40.00, 100.00, '2025-12-31', 'active');

-- ============================================
-- INSERT SAMPLE REVIEWS
-- ============================================
INSERT INTO reviews (product_id, user_id, user_name, rating, comment) VALUES
(1, 2, 'John Customer', 5, 'Absolutely delicious! The chocolate was rich and the cake was moist. Will order again!'),
(2, 2, 'John Customer', 4, 'Great taste but delivery was a bit delayed.'),
(3, 2, 'John Customer', 5, 'Perfect red velvet cake for my birthday. Everyone loved it!'),
(5, 2, 'John Customer', 4, 'Fresh and healthy bread. Good for daily consumption.');

SELECT 'Database setup complete!' AS message;
