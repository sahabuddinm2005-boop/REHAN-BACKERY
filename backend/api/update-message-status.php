<?php
/**
 * Update Message Status API (Admin)
 * POST /api/update-message-status.php
 */

require_once '../config/cors.php';
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

$data = getJsonInput();

$message_id = isset($data['message_id']) ? intval($data['message_id']) : 0;
$status = isset($data['status']) ? trim($data['status']) : '';

if ($message_id <= 0) {
    sendError('Message ID is required');
}

if (!in_array($status, ['unread', 'read'])) {
    sendError('Invalid status');
}

try {
    $db = new Database();
    $conn = $db->getConnection();
    
    $stmt = $conn->prepare("UPDATE contact_messages SET status = :status WHERE id = :message_id");
    $stmt->bindParam(':status', $status);
    $stmt->bindParam(':message_id', $message_id, PDO::PARAM_INT);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        sendResponse(true, 'Message status updated');
    } else {
        sendError('Message not found', 404);
    }
    
} catch (PDOException $e) {
    sendError('Database error: ' . $e->getMessage(), 500);
}
?>
