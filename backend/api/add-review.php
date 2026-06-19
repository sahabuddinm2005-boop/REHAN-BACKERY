<?php
/**
 * Add Review API
 * POST /api/add-review.php
 */

require_once '../config/cors.php';
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

$data = getJsonInput();

$product_id = isset($data['product_id']) ? intval($data['product_id']) : 0;
$user_id = isset($data['user_id']) ? intval($data['user_id']) : 0;
$user_name = isset($data['user_name']) ? trim($data['user_name']) : '';
$rating = isset($data['rating']) ? intval($data['rating']) : 0;
$comment = isset($data['comment']) ? trim($data['comment']) : '';

if ($product_id <= 0) {
    sendError('Product ID is required');
}

if ($user_id <= 0) {
    sendError('User ID is required');
}

if (empty($user_name)) {
    sendError('User name is required');
}

if ($rating < 1 || $rating > 5) {
    sendError('Rating must be between 1 and 5');
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
    
    // Check if user already reviewed this product
    $checkStmt = $conn->prepare("
        SELECT id FROM reviews 
        WHERE product_id = :product_id AND user_id = :user_id
    ");
    $checkStmt->bindParam(':product_id', $product_id, PDO::PARAM_INT);
    $checkStmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $checkStmt->execute();
    
    if ($checkStmt->fetch()) {
        sendError('You have already reviewed this product');
    }
    
    // Insert review
    $stmt = $conn->prepare("
        INSERT INTO reviews (product_id, user_id, user_name, rating, comment)
        VALUES (:product_id, :user_id, :user_name, :rating, :comment)
    ");
    $stmt->bindParam(':product_id', $product_id, PDO::PARAM_INT);
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->bindParam(':user_name', $user_name);
    $stmt->bindParam(':rating', $rating, PDO::PARAM_INT);
    $stmt->bindParam(':comment', $comment);
    $stmt->execute();
    
    sendResponse(true, 'Review added successfully', [
        'review_id' => $conn->lastInsertId()
    ]);
    
} catch (PDOException $e) {
    sendError('Database error: ' . $e->getMessage(), 500);
}
?>
