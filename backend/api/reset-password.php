<?php
/**
 * Reset Password API
 * POST /api/reset-password.php
 */

require_once '../config/cors.php';
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

$data = getJsonInput();
$token = isset($data['token']) ? trim($data['token']) : '';
$new_password = isset($data['new_password']) ? $data['new_password'] : '';
$confirm_password = isset($data['confirm_password']) ? $data['confirm_password'] : '';

if (empty($token)) {
    sendError('Reset token is required');
}

if (empty($new_password)) {
    sendError('New password is required');
}

if (strlen($new_password) < 6) {
    sendError('Password must be at least 6 characters long');
}

if ($new_password !== $confirm_password) {
    sendError('Passwords do not match');
}

try {
    $db = new Database();
    $conn = $db->getConnection();
    
    // Find user by reset token
    $stmt = $conn->prepare("
        SELECT id, email, reset_token_expiry 
        FROM users 
        WHERE reset_token = :token
    ");
    $stmt->bindParam(':token', $token);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        sendError('Invalid or expired reset token');
    }
    
    // Check if token has expired
    if (strtotime($user['reset_token_expiry']) < time()) {
        sendError('Reset token has expired. Please request a new one.');
    }
    
    // Hash new password
    $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
    
    // Update password and clear reset token
    $updateStmt = $conn->prepare("
        UPDATE users 
        SET password = :password, reset_token = NULL, reset_token_expiry = NULL 
        WHERE id = :user_id
    ");
    $updateStmt->bindParam(':password', $hashed_password);
    $updateStmt->bindParam(':user_id', $user['id'], PDO::PARAM_INT);
    $updateStmt->execute();
    
    sendResponse(true, 'Password reset successfully. You can now login with your new password.');
    
} catch (PDOException $e) {
    sendError('Database error: ' . $e->getMessage(), 500);
}
?>
