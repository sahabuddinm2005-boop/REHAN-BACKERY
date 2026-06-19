<?php
/**
 * Add Coupon API (Admin)
 * POST /api/add-coupon.php
 */

require_once '../config/cors.php';
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

$data = getJsonInput();

$code = isset($data['code']) ? strtoupper(trim($data['code'])) : '';
$discount_type = isset($data['discount_type']) ? trim($data['discount_type']) : '';
$discount_value = isset($data['discount_value']) ? floatval($data['discount_value']) : 0;
$min_order_amount = isset($data['min_order_amount']) ? floatval($data['min_order_amount']) : 0;
$expiry_date = isset($data['expiry_date']) ? trim($data['expiry_date']) : '';
$status = isset($data['status']) ? trim($data['status']) : 'active';

if (empty($code)) {
    sendError('Coupon code is required');
}

if (!in_array($discount_type, ['percentage', 'fixed'])) {
    sendError('Invalid discount type');
}

if ($discount_value <= 0) {
    sendError('Discount value must be greater than 0');
}

if ($discount_type === 'percentage' && $discount_value > 100) {
    sendError('Percentage discount cannot exceed 100%');
}

try {
    $db = new Database();
    $conn = $db->getConnection();
    
    // Check if coupon code already exists
    $checkStmt = $conn->prepare("SELECT id FROM coupons WHERE code = :code");
    $checkStmt->bindParam(':code', $code);
    $checkStmt->execute();
    
    if ($checkStmt->fetch()) {
        sendError('Coupon code already exists');
    }
    
    // Insert coupon
    $stmt = $conn->prepare("
        INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, expiry_date, status)
        VALUES (:code, :discount_type, :discount_value, :min_order_amount, :expiry_date, :status)
    ");
    $stmt->bindParam(':code', $code);
    $stmt->bindParam(':discount_type', $discount_type);
    $stmt->bindParam(':discount_value', $discount_value);
    $stmt->bindParam(':min_order_amount', $min_order_amount);
    $stmt->bindParam(':expiry_date', $expiry_date);
    $stmt->bindParam(':status', $status);
    $stmt->execute();
    
    sendResponse(true, 'Coupon created successfully', [
        'coupon_id' => $conn->lastInsertId()
    ]);
    
} catch (PDOException $e) {
    sendError('Database error: ' . $e->getMessage(), 500);
}
?>
