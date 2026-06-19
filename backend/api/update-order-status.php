<?php
/**
 * Update Order Status API
 * POST /api/update-order-status.php
 */

require_once '../config/cors.php';
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

$data = getJsonInput();

$order_id = isset($data['order_id']) ? intval($data['order_id']) : 0;
$order_status = isset($data['order_status']) ? trim($data['order_status']) : '';

if ($order_id <= 0) {
    sendError('Order ID is required');
}

$valid_statuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
if (!in_array($order_status, $valid_statuses)) {
    sendError('Invalid order status');
}

try {
    $db = new Database();
    $conn = $db->getConnection();
    
    // Check if order exists
    $checkStmt = $conn->prepare("SELECT id, order_status FROM orders WHERE id = :order_id");
    $checkStmt->bindParam(':order_id', $order_id, PDO::PARAM_INT);
    $checkStmt->execute();
    $order = $checkStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$order) {
        sendError('Order not found', 404);
    }
    
    // Update order status
    $stmt = $conn->prepare("UPDATE orders SET order_status = :order_status WHERE id = :order_id");
    $stmt->bindParam(':order_status', $order_status);
    $stmt->bindParam(':order_id', $order_id, PDO::PARAM_INT);
    $stmt->execute();
    
    // If delivered, mark payment as paid for COD
    if ($order_status === 'delivered') {
        $paymentStmt = $conn->prepare("UPDATE orders SET payment_status = 'paid' WHERE id = :order_id AND payment_method = 'cod'");
        $paymentStmt->bindParam(':order_id', $order_id, PDO::PARAM_INT);
        $paymentStmt->execute();
    }
    
    sendResponse(true, 'Order status updated successfully');
    
} catch (PDOException $e) {
    sendError('Database error: ' . $e->getMessage(), 500);
}
?>
