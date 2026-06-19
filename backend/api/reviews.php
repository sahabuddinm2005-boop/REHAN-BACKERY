<?php
/**
 * Reviews API - Get reviews for a product
 * GET /api/reviews.php?product_id=1
 */

require_once '../config/cors.php';
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', 405);
}

$product_id = isset($_GET['product_id']) ? intval($_GET['product_id']) : 0;

if ($product_id <= 0) {
    sendError('Product ID is required');
}

try {
    $db = new Database();
    $conn = $db->getConnection();
    
    // Get reviews for the product
    $stmt = $conn->prepare("
        SELECT 
            r.id,
            r.user_id,
            r.user_name,
            r.rating,
            r.comment,
            r.created_at
        FROM reviews r
        WHERE r.product_id = :product_id
        ORDER BY r.created_at DESC
    ");
    $stmt->bindParam(':product_id', $product_id, PDO::PARAM_INT);
    $stmt->execute();
    $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Calculate average rating
    $avgStmt = $conn->prepare("
        SELECT 
            AVG(rating) as average_rating,
            COUNT(*) as total_reviews
        FROM reviews
        WHERE product_id = :product_id
    ");
    $avgStmt->bindParam(':product_id', $product_id, PDO::PARAM_INT);
    $avgStmt->execute();
    $stats = $avgStmt->fetch(PDO::FETCH_ASSOC);
    
    sendResponse(true, 'Reviews retrieved successfully', [
        'reviews' => $reviews,
        'average_rating' => round($stats['average_rating'] ?? 0, 1),
        'total_reviews' => (int)$stats['total_reviews']
    ]);
    
} catch (PDOException $e) {
    sendError('Database error: ' . $e->getMessage(), 500);
}
?>
