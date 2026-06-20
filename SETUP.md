# Rehan Bakery Shop - Setup Guide

A full-stack bakery e-commerce application with React + Vite frontend and PHP REST API backend.

## Project Structure

```
rehan-bakery-shop/
├── src/                      # React Frontend
│   ├── components/           # Reusable components
│   ├── pages/                # Page components
│   ├── context/              # React Context (Cart, Auth)
│   ├── api/                  # API service layer
│   ├── data/                 # Mock data for demo
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # Entry point
│   └── style.css             # Global styles
├── backend/                  # PHP REST API
│   ├── api/                  # API endpoints
│   └── config/               # Database configuration
├── database/                 # SQL schema and seed data
├── index.html                # HTML entry point
├── vite.config.js            # Vite configuration
└── package.json              # Dependencies
```

## Prerequisites

- Node.js (v18 or higher)
- XAMPP/WAMP/MAMP (for PHP & MySQL)
- A modern web browser

## Frontend Setup (React + Vite)

The frontend works standalone with mock data for demo purposes.

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Demo Credentials

- **Admin**: admin@bakery.com / admin123
- **User**: user@example.com / user123

## Backend Setup (PHP + MySQL)

To enable full backend functionality with persistent data:

### 1. Start XAMPP/WAMP

Ensure Apache and MySQL services are running.

### 2. Create Database

1. Open phpMyAdmin (http://localhost/phpmyadmin)
2. Import the SQL file: `database/rehan_bakery_shop.sql`
   - This creates the database, tables, and sample data

### 3. Configure Database Connection

Edit `backend/config/db.php` if needed:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'rehan_bakery_shop');
define('DB_USER', 'root');
define('DB_PASS', ''); // Your MySQL password
```

### 4. Move Backend Files

Copy the `backend` folder to your web server directory:
- XAMPP: `C:/xampp/htdocs/rehan-bakery-shop/`
- WAMP: `C:/wamp64/www/rehan-bakery-shop/`
- MAMP: `/Applications/MAMP/htdocs/rehan-bakery-shop/`

### 5. Update Frontend API URL

Edit `src/api/api.js`:

```javascript
const API_BASE_URL = 'http://localhost/rehan-bakery-shop/backend/api'
const USE_MOCK = false // Change to false to use PHP backend
```

### 6. Test the API

Test endpoints in your browser or with a tool like Postman:

- GET `http://localhost/rehan-bakery-shop/backend/api/products.php`
- POST `http://localhost/rehan-bakery-shop/backend/api/login.php`

## API Endpoints

### Authentication
- `POST /api/register.php` - Register new user
- `POST /api/login.php` - User login

### Products
- `GET /api/products.php` - Get all products (with optional filters)
- `GET /api/product.php?id={id}` - Get single product
- `POST /api/add-product.php` - Add product (admin)
- `PUT /api/update-product.php` - Update product (admin)
- `DELETE /api/delete-product.php` - Delete product (admin)

### Orders
- `POST /api/place-order.php` - Place new order
- `GET /api/orders.php` - Get all orders (admin)

## Features

### Customer Features
- Browse products by category
- Search products
- Add to cart
- Place orders
- User registration and login

### Admin Features
- Product management (CRUD)
- View orders
- Dashboard with statistics

## Database Schema

### Users Table
- id, name, email, password, phone, address, role, timestamps

### Products Table
- id, name, description, price, category, image, stock, status, timestamps

### Orders Table
- id, user_id, customer details, total_amount, payment_method, status, timestamps

### Order Items Table
- id, order_id, product_id, product_name, product_price, quantity, subtotal

## Technologies Used

### Frontend
- React 18
- React Router v6
- Vite
- Lucide React Icons
- CSS3 with CSS Variables

### Backend
- PHP 8+
- MySQL
- PDO for database access
- RESTful API design

## Troubleshooting

### CORS Issues
If you get CORS errors, ensure:
1. Apache is running
2. The backend URL is correct
3. CORS headers are set in PHP files (already configured)

### Database Connection Failed
1. Check MySQL is running
2. Verify credentials in `db.php`
3. Ensure the database exists

### Frontend Not Connecting to Backend
1. Set `USE_MOCK = false` in `api.js`
2. Update `API_BASE_URL` to your backend path
3. Restart the Vite dev server

## License

This project is for educational purposes.
