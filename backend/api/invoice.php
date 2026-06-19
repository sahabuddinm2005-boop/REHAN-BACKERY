<?php
/**
 * Invoice API - Get order details for invoice
 * GET /api/invoice.php?order_id=1
 */

require_once '../config/cors.php';
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', 405);
}

$order_id = isset($_GET['order_id']) ? intval($_GET['order_id']) : 0;

if ($order_id <= 0) {
    sendError('Order ID is required');
}

try {
    $db = new Database();
    $conn = $db->getConnection();
    
    // Get order details
    $stmt = $conn->prepare("
        SELECT 
            o.*,
            u.email as customer_email
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        WHERE o.id = :order_id
    ");
    $stmt->bindParam(':order_id', $order_id, PDO::PARAM_INT);
    $stmt->execute();
    $order = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$order) {
        sendError('Order not found', 404);
    }
    
    // Get order items
    $itemsStmt = $conn->prepare("
        SELECT 
            oi.*,
            p.image
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = :order_id
    ");
    $itemsStmt->bindParam(':order_id', $order_id, PDO::PARAM_INT);
    $itemsStmt->execute();
    $order['items'] = $itemsStmt->fetchAll(PDO::FETCH_ASSOC);
    
    sendResponse(true, 'Invoice data retrieved successfully', ['order' => $order]);
    
} catch (PDOException $e) {
    sendError('Database error: ' . $e->getMessage(), 500);
}
?>
