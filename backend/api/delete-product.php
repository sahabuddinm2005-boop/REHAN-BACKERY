<?php
/**
 * Delete Product API (Admin Only)
 * DELETE /api/delete-product.php
 */

require_once '../config/db.php';
setCorsHeaders();

// Only accept DELETE requests
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

// Get input data
$data = getJsonInput();

// Validate product ID
if (!isset($data['id']) || !is_numeric($data['id'])) {
    jsonResponse(['success' => false, 'message' => 'Valid product ID is required'], 400);
}

$productId = (int)$data['id'];

try {
    $pdo = getConnection();
    
    // Check if product exists
    $stmt = $pdo->prepare("SELECT id, name FROM products WHERE id = ?");
    $stmt->execute([$productId]);
    $product = $stmt->fetch();
    
    if (!$product) {
        jsonResponse(['success' => false, 'message' => 'Product not found'], 404);
    }
    
    // Delete the product
    $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
    $stmt->execute([$productId]);
    
    jsonResponse([
        'success' => true,
        'message' => "Product '{$product['name']}' deleted successfully"
    ]);
    
} catch (PDOException $e) {
    jsonResponse([
        'success' => false,
        'message' => 'Failed to delete product: ' . $e->getMessage()
    ], 500);
}
?>
