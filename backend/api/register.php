<?php
/**
 * User Registration API
 * POST /api/register.php
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
$required = ['name', 'email', 'password'];
$missing = validateRequired($data, $required);

if (!empty($missing)) {
    jsonResponse([
        'success' => false,
        'message' => 'Missing required fields: ' . implode(', ', $missing)
    ], 400);
}

// Sanitize inputs
$name = sanitize($data['name']);
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$password = $data['password'];
$phone = isset($data['phone']) ? sanitize($data['phone']) : null;
$address = isset($data['address']) ? sanitize($data['address']) : null;
// Public registration always creates a normal customer account.
// Delivery account upgrade is requested later from the Profile page and approved by admin.
$role = 'customer';

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['success' => false, 'message' => 'Invalid email format'], 400);
}

// Validate password length
if (strlen($password) < 6) {
    jsonResponse(['success' => false, 'message' => 'Password must be at least 6 characters'], 400);
}

try {
    $pdo = getConnection();
    
    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->fetch()) {
        jsonResponse(['success' => false, 'message' => 'Email already registered'], 409);
    }
    
    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    // Insert new user
    $stmt = $pdo->prepare("
        INSERT INTO users (full_name, email, password, phone, address, role) 
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([$name, $email, $hashedPassword, $phone, $address, $role]);
    
    $userId = $pdo->lastInsertId();
    
    jsonResponse([
        'success' => true,
        'message' => 'Registration successful! You can now login.',
        'user_id' => $userId
    ], 201);
    
} catch (PDOException $e) {
    jsonResponse([
        'success' => false,
        'message' => 'Registration failed: ' . $e->getMessage()
    ], 500);
}
?>
