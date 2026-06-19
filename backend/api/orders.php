<?php
/**
 * Get Orders API (Admin Only)
 * GET /api/orders.php
 * 
 * Query Parameters:
 * - status: Filter by status (pending, processing, completed, cancelled)
 * - user_id: Filter by user ID
 */

require_once '../config/db.php';
setCorsHeaders();

// Only accept GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

try {
    $pdo = getConnection();
    
    // Build query with optional filters
    $sql = "SELECT o.*, 
            (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) as item_count
            FROM orders o WHERE 1=1";
    $params = [];
    
    // Status filter
    if (isset($_GET['status']) && !empty($_GET['status'])) {
        $sql .= " AND o.status = ?";
        $params[] = sanitize($_GET['status']);
    }
    
    // User filter
    if (isset($_GET['user_id']) && is_numeric($_GET['user_id'])) {
        $sql .= " AND o.user_id = ?";
        $params[] = (int)$_GET['user_id'];
    }
    
    // Order by newest first
    $sql .= " ORDER BY o.created_at DESC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $orders = $stmt->fetchAll();
    
    // Fetch items for each order
    $itemStmt = $pdo->prepare("SELECT * FROM order_items WHERE order_id = ?");
    
    foreach ($orders as &$order) {
        $order['id'] = (int)$order['id'];
        $order['user_id'] = $order['user_id'] ? (int)$order['user_id'] : null;
        $order['total_amount'] = (float)$order['total_amount'];
        $order['item_count'] = (int)$order['item_count'];
        
        // Get order items
        $itemStmt->execute([$order['id']]);
        $items = $itemStmt->fetchAll();
        
        foreach ($items as &$item) {
            $item['id'] = (int)$item['id'];
            $item['product_id'] = (int)$item['product_id'];
            $item['product_price'] = (float)$item['product_price'];
            $item['quantity'] = (int)$item['quantity'];
            $item['subtotal'] = (float)$item['subtotal'];
        }
        
        $order['items'] = $items;
    }
    
    jsonResponse([
        'success' => true,
        'data' => $orders,
        'count' => count($orders)
    ]);
    
} catch (PDOException $e) {
    jsonResponse([
        'success' => false,
        'message' => 'Failed to fetch orders: ' . $e->getMessage()
    ], 500);
}
?>
