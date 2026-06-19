<?php
/**
 * Cancel Order API
 * POST /api/cancel-order.php
 */

require_once '../config/cors.php';
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

$data = getJsonInput();

$order_id = isset($data['order_id']) ? intval($data['order_id']) : 0;
$user_id = isset($data['user_id']) ? intval($data['user_id']) : 0;
$is_admin = isset($data['is_admin']) ? (bool)$data['is_admin'] : false;

if ($order_id <= 0) {
    sendError('Order ID is required');
}

try {
    $db = new Database();
    $conn = $db->getConnection();
    
    // Get order
    $stmt = $conn->prepare("SELECT * FROM orders WHERE id = :order_id");
    $stmt->bindParam(':order_id', $order_id, PDO::PARAM_INT);
    $stmt->execute();
    $order = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$order) {
        sendError('Order not found', 404);
    }
    
    // Check if user owns this order (if not admin)
    if (!$is_admin && $order['user_id'] !== $user_id) {
        sendError('You can only cancel your own orders', 403);
    }
    
    // Define cancellable statuses
    $cancellable_by_user = ['pending', 'confirmed'];
    $non_cancellable = ['delivered'];
    
    // Check if order can be cancelled
    if (in_array($order['order_status'], $non_cancellable)) {
        sendError('Delivered orders cannot be cancelled');
    }
    
    if (!$is_admin && !in_array($order['order_status'], $cancellable_by_user)) {
        sendError('Orders that are being prepared or out for delivery cannot be cancelled');
    }
    
    // Cancel order
    $updateStmt = $conn->prepare("UPDATE orders SET order_status = 'cancelled' WHERE id = :order_id");
    $updateStmt->bindParam(':order_id', $order_id, PDO::PARAM_INT);
    $updateStmt->execute();
    
    // Restore stock
    $itemsStmt = $conn->prepare("SELECT product_id, quantity FROM order_items WHERE order_id = :order_id");
    $itemsStmt->bindParam(':order_id', $order_id, PDO::PARAM_INT);
    $itemsStmt->execute();
    $items = $itemsStmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($items as $item) {
        $restoreStmt = $conn->prepare("UPDATE products SET stock = stock + :quantity WHERE id = :product_id");
        $restoreStmt->bindParam(':quantity', $item['quantity'], PDO::PARAM_INT);
        $restoreStmt->bindParam(':product_id', $item['product_id'], PDO::PARAM_INT);
        $restoreStmt->execute();
    }
    
    sendResponse(true, 'Order cancelled successfully');
    
} catch (PDOException $e) {
    sendError('Database error: ' . $e->getMessage(), 500);
}
?>
