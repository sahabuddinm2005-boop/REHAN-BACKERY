<?php
/**
 * Apply Coupon API
 * POST /api/apply-coupon.php
 */

require_once '../config/cors.php';
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

$data = getJsonInput();

$code = isset($data['code']) ? strtoupper(trim($data['code'])) : '';
$order_amount = isset($data['order_amount']) ? floatval($data['order_amount']) : 0;

if (empty($code)) {
    sendError('Coupon code is required');
}

if ($order_amount <= 0) {
    sendError('Order amount is required');
}

try {
    $db = new Database();
    $conn = $db->getConnection();
    
    // Get coupon
    $stmt = $conn->prepare("
        SELECT * FROM coupons 
        WHERE code = :code
    ");
    $stmt->bindParam(':code', $code);
    $stmt->execute();
    $coupon = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$coupon) {
        sendError('Invalid coupon code');
    }
    
    // Check if coupon is active
    if ($coupon['status'] !== 'active') {
        sendError('This coupon is no longer active');
    }
    
    // Check expiry date
    if (!empty($coupon['expiry_date']) && strtotime($coupon['expiry_date']) < strtotime('today')) {
        sendError('This coupon has expired');
    }
    
    // Check minimum order amount
    if ($order_amount < $coupon['min_order_amount']) {
        sendError('Minimum order amount of ₹' . number_format($coupon['min_order_amount'], 2) . ' required for this coupon');
    }
    
    // Calculate discount
    $discount_amount = 0;
    if ($coupon['discount_type'] === 'percentage') {
        $discount_amount = ($order_amount * $coupon['discount_value']) / 100;
    } else {
        $discount_amount = $coupon['discount_value'];
    }
    
    // Make sure discount doesn't exceed order amount
    $discount_amount = min($discount_amount, $order_amount);
    
    sendResponse(true, 'Coupon applied successfully', [
        'coupon_code' => $coupon['code'],
        'discount_type' => $coupon['discount_type'],
        'discount_value' => $coupon['discount_value'],
        'discount_amount' => round($discount_amount, 2)
    ]);
    
} catch (PDOException $e) {
    sendError('Database error: ' . $e->getMessage(), 500);
}
?>
