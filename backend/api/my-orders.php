<?php
/**
 * My Orders API - Get orders for a specific user
 * GET /api/my-orders.php?user_id=1
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
    
    // Get all orders for the user
    $stmt = $conn->prepare("
        SELECT 
            o.id,
            o.customer_name,
            o.phone,
            o.address,
            o.total_amount,
            o.coupon_code,
            o.discount_amount,
            o.delivery_charge,
            o.final_amount,
            o.payment_method,
            o.payment_status,
            o.order_status,
            o.created_at
        FROM orders o
        WHERE o.user_id = :user_id
        ORDER BY o.created_at DESC
    ");
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get order items for each order
    foreach ($orders as &$order) {
        $itemStmt = $conn->prepare("
            SELECT 
                oi.product_id,
                oi.product_name,
                oi.quantity,
                oi.price,
                oi.subtotal
            FROM order_items oi
            WHERE oi.order_id = :order_id
        ");
        $itemStmt->bindParam(':order_id', $order['id'], PDO::PARAM_INT);
        $itemStmt->execute();
        $order['items'] = $itemStmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    sendResponse(true, 'Orders retrieved successfully', ['orders' => $orders]);
    
} catch (PDOException $e) {
    sendError('Database error: ' . $e->getMessage(), 500);
}
?>
