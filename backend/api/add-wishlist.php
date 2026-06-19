<?php
/**
 * Add to Wishlist API
 * POST /api/add-wishlist.php
 */

require_once '../config/cors.php';
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

$data = getJsonInput();

$user_id = isset($data['user_id']) ? intval($data['user_id']) : 0;
$product_id = isset($data['product_id']) ? intval($data['product_id']) : 0;

if ($user_id <= 0) {
    sendError('User ID is required');
}

if ($product_id <= 0) {
    sendError('Product ID is required');
}

try {
    $db = new Database();
    $conn = $db->getConnection();
    
    // Check if product exists
    $productStmt = $conn->prepare("SELECT id FROM products WHERE id = :product_id");
    $productStmt->bindParam(':product_id', $product_id, PDO::PARAM_INT);
    $productStmt->execute();
    
    if (!$productStmt->fetch()) {
        sendError('Product not found', 404);
    }
    
    // Check if already in wishlist
    $checkStmt = $conn->prepare("
        SELECT id FROM wishlist 
        WHERE user_id = :user_id AND product_id = :product_id
    ");
    $checkStmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $checkStmt->bindParam(':product_id', $product_id, PDO::PARAM_INT);
    $checkStmt->execute();
    
    if ($checkStmt->fetch()) {
        sendError('Product already in wishlist');
    }
    
    // Add to wishlist
    $stmt = $conn->prepare("
        INSERT INTO wishlist (user_id, product_id)
        VALUES (:user_id, :product_id)
    ");
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->bindParam(':product_id', $product_id, PDO::PARAM_INT);
    $stmt->execute();
    
    sendResponse(true, 'Product added to wishlist');
    
} catch (PDOException $e) {
    sendError('Database error: ' . $e->getMessage(), 500);
}
?>
