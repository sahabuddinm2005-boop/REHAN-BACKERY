<?php
/**
 * Remove from Wishlist API
 * POST /api/remove-wishlist.php
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
    
    $stmt = $conn->prepare("
        DELETE FROM wishlist 
        WHERE user_id = :user_id AND product_id = :product_id
    ");
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->bindParam(':product_id', $product_id, PDO::PARAM_INT);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        sendResponse(true, 'Product removed from wishlist');
    } else {
        sendError('Product not found in wishlist');
    }
    
} catch (PDOException $e) {
    sendError('Database error: ' . $e->getMessage(), 500);
}
?>
