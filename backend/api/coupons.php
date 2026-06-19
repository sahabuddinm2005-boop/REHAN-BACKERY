<?php
/**
 * Coupons API - Get all coupons (Admin)
 * GET /api/coupons.php
 */

require_once '../config/cors.php';
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', 405);
}

try {
    $db = new Database();
    $conn = $db->getConnection();
    
    $stmt = $conn->prepare("
        SELECT 
            id,
            code,
            discount_type,
            discount_value,
            min_order_amount,
            expiry_date,
            status,
            created_at
        FROM coupons
        ORDER BY created_at DESC
    ");
    $stmt->execute();
    $coupons = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    sendResponse(true, 'Coupons retrieved successfully', ['coupons' => $coupons]);
    
} catch (PDOException $e) {
    sendError('Database error: ' . $e->getMessage(), 500);
}
?>
