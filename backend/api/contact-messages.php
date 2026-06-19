<?php
/**
 * Contact Messages API (Admin)
 * GET /api/contact-messages.php
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
            name,
            email,
            phone,
            message,
            status,
            created_at
        FROM contact_messages
        ORDER BY created_at DESC
    ");
    $stmt->execute();
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    sendResponse(true, 'Messages retrieved successfully', ['messages' => $messages]);
    
} catch (PDOException $e) {
    sendError('Database error: ' . $e->getMessage(), 500);
}
?>
