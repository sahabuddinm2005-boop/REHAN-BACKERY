<?php
/**
 * Wishlist API - Get wishlist for a user
 * GET /api/wishlist.php?user_id=1
 */

require_once '../config/cors.php';
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', 405);
}

$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

if ($user_id <= 0) {
    sendError('User ID is required');
}

try {
    $db = new Database();
    $conn = $db->getConnection();
    
    $stmt = $conn->prepare("
        SELECT 
            w.id as wishlist_id,
            w.created_at as added_at,
            p.id,
            p.name,
            p.description,
            p.price,
            p.image,
            p.category,
            p.stock
        FROM wishlist w
        JOIN products p ON w.product_id = p.id
        WHERE w.user_id = :user_id
        ORDER BY w.created_at DESC
    ");
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();
    $wishlist = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    sendResponse(true, 'Wishlist retrieved successfully', ['wishlist' => $wishlist]);
    
} catch (PDOException $e) {
    sendError('Database error: ' . $e->getMessage(), 500);
}
?>
