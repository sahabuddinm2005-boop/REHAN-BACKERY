<?php
/**
 * User Login API
 * POST /api/login.php
 */

require_once '../config/db.php';
setCorsHeaders();

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

// Get input data
$data = getJsonInput();

// Validate required fields
$required = ['email', 'password'];
$missing = validateRequired($data, $required);

if (!empty($missing)) {
    jsonResponse([
        'success' => false,
        'message' => 'Email and password are required'
    ], 400);
}

$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$password = $data['password'];

try {
    $pdo = getConnection();
    
    // Find user by email
    $stmt = $pdo->prepare("
        SELECT id, full_name AS name, email, password, phone, address, role 
        FROM users 
        WHERE email = ?
    ");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if (!$user) {
        jsonResponse(['success' => false, 'message' => 'Invalid email or password'], 401);
    }
    
    // Verify password
    if (!password_verify($password, $user['password'])) {
        jsonResponse(['success' => false, 'message' => 'Invalid email or password'], 401);
    }
    
    // Remove password from response
    unset($user['password']);
    
    jsonResponse([
        'success' => true,
        'message' => 'Login successful',
        'user' => $user
    ]);
    
} catch (PDOException $e) {
    jsonResponse([
        'success' => false,
        'message' => 'Login failed: ' . $e->getMessage()
    ], 500);
}
?>
