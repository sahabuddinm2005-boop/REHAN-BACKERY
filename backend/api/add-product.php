<?php
/**
 * Add New Product API (Admin Only)
 * POST /api/add-product.php
 */

require_once '../config/db.php';
setCorsHeaders();

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

// Get input data
$data = getJsonInput();

// Validate required fields
$required = ['name', 'description', 'price', 'category', 'image', 'stock'];
$missing = validateRequired($data, $required);

if (!empty($missing)) {
    jsonResponse([
        'success' => false,
        'message' => 'Missing required fields: ' . implode(', ', $missing)
    ], 400);
}

// Sanitize and validate inputs
$name = sanitize($data['name']);
$description = sanitize($data['description']);
$price = (float)$data['price'];
$category = sanitize($data['category']);
$image = filter_var($data['image'], FILTER_SANITIZE_URL);
$stock = (int)$data['stock'];
$status = isset($data['status']) ? sanitize($data['status']) : 'available';

// Validate price
if ($price <= 0) {
    jsonResponse(['success' => false, 'message' => 'Price must be greater than 0'], 400);
}

// Validate category
$validCategories = ['Cakes', 'Pastries', 'Breads', 'Cookies'];
if (!in_array($category, $validCategories)) {
    jsonResponse([
        'success' => false,
        'message' => 'Invalid category. Must be one of: ' . implode(', ', $validCategories)
    ], 400);
}

// Validate status
$validStatuses = ['available', 'unavailable'];
if (!in_array($status, $validStatuses)) {
    $status = 'available';
}

try {
    $pdo = getConnection();
    
    $stmt = $pdo->prepare("
        INSERT INTO products (name, description, price, category, image, stock, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([$name, $description, $price, $category, $image, $stock, $status]);
    
    $productId = $pdo->lastInsertId();
    
    // Fetch the newly created product
    $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->execute([$productId]);
    $product = $stmt->fetch();
    
    $product['price'] = (float)$product['price'];
    $product['stock'] = (int)$product['stock'];
    $product['id'] = (int)$product['id'];
    
    jsonResponse([
        'success' => true,
        'message' => 'Product added successfully',
        'data' => $product
    ], 201);
    
} catch (PDOException $e) {
    jsonResponse([
        'success' => false,
        'message' => 'Failed to add product: ' . $e->getMessage()
    ], 500);
}
?>
