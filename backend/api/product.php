<?php
/**
 * Get Single Product API
 * GET /api/product.php?id={id}
 */

require_once '../config/db.php';
setCorsHeaders();

// Only accept GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

// Validate product ID
if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    jsonResponse(['success' => false, 'message' => 'Valid product ID is required'], 400);
}

$productId = (int)$_GET['id'];

try {
    $pdo = getConnection();
    
    $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->execute([$productId]);
    $product = $stmt->fetch();
    
    if (!$product) {
        jsonResponse(['success' => false, 'message' => 'Product not found'], 404);
    }
    
    // Convert types
    $product['price'] = (float)$product['price'];
    $product['stock'] = (int)$product['stock'];
    $product['id'] = (int)$product['id'];
    
    jsonResponse([
        'success' => true,
        'data' => $product
    ]);
    
} catch (PDOException $e) {
    jsonResponse([
        'success' => false,
        'message' => 'Failed to fetch product: ' . $e->getMessage()
    ], 500);
}
?>
