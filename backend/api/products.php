<?php
/**
 * Get All Products API
 * GET /api/products.php
 * 
 * Query Parameters:
 * - category: Filter by category (Cakes, Pastries, Breads, Cookies)
 * - search: Search in name and description
 * - status: Filter by status (available, unavailable)
 */

require_once '../config/db.php';
setCorsHeaders();

// Only accept GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

try {
    $pdo = getConnection();
    
    // Build query with optional filters
    $sql = "SELECT * FROM products WHERE 1=1";
    $params = [];
    
    // Category filter
    if (isset($_GET['category']) && !empty($_GET['category']) && $_GET['category'] !== 'All') {
        $sql .= " AND category = ?";
        $params[] = sanitize($_GET['category']);
    }
    
    // Search filter
    if (isset($_GET['search']) && !empty($_GET['search'])) {
        $search = '%' . sanitize($_GET['search']) . '%';
        $sql .= " AND (name LIKE ? OR description LIKE ?)";
        $params[] = $search;
        $params[] = $search;
    }
    
    // Status filter
    if (isset($_GET['status']) && !empty($_GET['status'])) {
        $sql .= " AND status = ?";
        $params[] = sanitize($_GET['status']);
    }
    
    // Order by newest first
    $sql .= " ORDER BY created_at DESC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $products = $stmt->fetchAll();
    
    // Convert price and stock to proper types
    foreach ($products as &$product) {
        $product['price'] = (float)$product['price'];
        $product['stock'] = (int)$product['stock'];
        $product['id'] = (int)$product['id'];
    }
    
    jsonResponse([
        'success' => true,
        'data' => $products,
        'count' => count($products)
    ]);
    
} catch (PDOException $e) {
    jsonResponse([
        'success' => false,
        'message' => 'Failed to fetch products: ' . $e->getMessage()
    ], 500);
}
?>
