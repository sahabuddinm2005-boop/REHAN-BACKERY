<?php
/**
 * Delete Coupon API (Admin)
 * POST /api/delete-coupon.php
 */

require_once '../config/cors.php';
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

$data = getJsonInput();

$coupon_id = isset($data['coupon_id']) ? intval($data['coupon_id']) : 0;

if ($coupon_id <= 0) {
    sendError('Coupon ID is required');
}

try {
    $db = new Database();
    $conn = $db->getConnection();
    
    $stmt = $conn->prepare("DELETE FROM coupons WHERE id = :coupon_id");
    $stmt->bindParam(':coupon_id', $coupon_id, PDO::PARAM_INT);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        sendResponse(true, 'Coupon deleted successfully');
    } else {
        sendError('Coupon not found', 404);
    }
    
} catch (PDOException $e) {
    sendError('Database error: ' . $e->getMessage(), 500);
}
?>
