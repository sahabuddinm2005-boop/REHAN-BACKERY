<?php
/**
 * Admin Statistics API
 * GET /api/admin-stats.php
 */

require_once '../config/cors.php';
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', 405);
}

try {
    $db = new Database();
    $conn = $db->getConnection();
    
    // Total products
    $productStmt = $conn->query("SELECT COUNT(*) as count FROM products");
    $total_products = $productStmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    // Total orders
    $orderStmt = $conn->query("SELECT COUNT(*) as count FROM orders");
    $total_orders = $orderStmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    // Total customers
    $customerStmt = $conn->query("SELECT COUNT(*) as count FROM users WHERE role = 'customer'");
    $total_customers = $customerStmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    // Total revenue
    $revenueStmt = $conn->query("SELECT COALESCE(SUM(final_amount), 0) as total FROM orders WHERE order_status = 'delivered'");
    $total_revenue = $revenueStmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    // Pending orders
    $pendingStmt = $conn->query("SELECT COUNT(*) as count FROM orders WHERE order_status = 'pending'");
    $pending_orders = $pendingStmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    // Delivered orders
    $deliveredStmt = $conn->query("SELECT COUNT(*) as count FROM orders WHERE order_status = 'delivered'");
    $delivered_orders = $deliveredStmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    // Low stock products (stock <= 5)
    $lowStockStmt = $conn->query("SELECT COUNT(*) as count FROM products WHERE stock <= 5 AND stock > 0");
    $low_stock_products = $lowStockStmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    // Out of stock products
    $outOfStockStmt = $conn->query("SELECT COUNT(*) as count FROM products WHERE stock = 0");
    $out_of_stock_products = $outOfStockStmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    // Today's orders
    $todayStmt = $conn->query("SELECT COUNT(*) as count FROM orders WHERE DATE(created_at) = CURDATE()");
    $todays_orders = $todayStmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    // Unread messages
    $messagesStmt = $conn->query("SELECT COUNT(*) as count FROM contact_messages WHERE status = 'unread'");
    $unread_messages = $messagesStmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    sendResponse(true, 'Statistics retrieved successfully', [
        'total_products' => (int)$total_products,
        'total_orders' => (int)$total_orders,
        'total_customers' => (int)$total_customers,
        'total_revenue' => round($total_revenue, 2),
        'pending_orders' => (int)$pending_orders,
        'delivered_orders' => (int)$delivered_orders,
        'low_stock_products' => (int)$low_stock_products,
        'out_of_stock_products' => (int)$out_of_stock_products,
        'todays_orders' => (int)$todays_orders,
        'unread_messages' => (int)$unread_messages
    ]);
    
} catch (PDOException $e) {
    sendError('Database error: ' . $e->getMessage(), 500);
}
?>
