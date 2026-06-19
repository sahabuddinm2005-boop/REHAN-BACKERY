<?php
/**
 * Forgot Password API
 * POST /api/forgot-password.php
 */

require_once '../config/cors.php';
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

$data = getJsonInput();
$email = isset($data['email']) ? trim($data['email']) : '';

if (empty($email)) {
    sendError('Email is required');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendError('Invalid email format');
}

try {
    $db = new Database();
    $conn = $db->getConnection();
    
    // Check if user exists
    $stmt = $conn->prepare("SELECT id, full_name, email FROM users WHERE email = :email");
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        sendError('No account found with this email address');
    }
    
    // Generate reset token
    $reset_token = bin2hex(random_bytes(32));
    $expiry_time = date('Y-m-d H:i:s', strtotime('+1 hour'));
    
    // Store reset token in database
    $updateStmt = $conn->prepare("
        UPDATE users 
        SET reset_token = :reset_token, reset_token_expiry = :expiry_time 
        WHERE id = :user_id
    ");
    $updateStmt->bindParam(':reset_token', $reset_token);
    $updateStmt->bindParam(':expiry_time', $expiry_time);
    $updateStmt->bindParam(':user_id', $user['id'], PDO::PARAM_INT);
    $updateStmt->execute();
    
    // For local development, return the reset link in response
    // In production, this would send an email instead
    $reset_link = "http://localhost:5173/reset-password?token=" . $reset_token;
    
    sendResponse(true, 'Password reset link generated successfully', [
        'reset_link' => $reset_link,
        'note' => 'In production, this link would be sent via email'
    ]);
    
} catch (PDOException $e) {
    sendError('Database error: ' . $e->getMessage(), 500);
}
?>
