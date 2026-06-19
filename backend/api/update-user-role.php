<?php
/**
 * Update User Role API (Admin)
 * POST /api/update-user-role.php
 */

require_once '../config/cors.php';
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

$data = getJsonInput();

$user_id = isset($data['user_id']) ? intval($data['user_id']) : 0;
$role = isset($data['role']) ? trim($data['role']) : '';

if ($user_id <= 0) {
    sendError('User ID is required');
}

if (!in_array($role, ['customer', 'admin'])) {
    sendError('Invalid role');
}

try {
    $db = new Database();
    $conn = $db->getConnection();
    
    // Check if user exists
    $checkStmt = $conn->prepare("SELECT id FROM users WHERE id = :user_id");
    $checkStmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $checkStmt->execute();
    
    if (!$checkStmt->fetch()) {
        sendError('User not found', 404);
    }
    
    $stmt = $conn->prepare("UPDATE users SET role = :role WHERE id = :user_id");
    $stmt->bindParam(':role', $role);
    $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $stmt->execute();
    
    sendResponse(true, 'User role updated successfully');
    
} catch (PDOException $e) {
    sendError('Database error: ' . $e->getMessage(), 500);
}
?>
