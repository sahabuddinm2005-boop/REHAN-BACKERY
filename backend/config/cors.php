<?php
/**
 * CORS Configuration
 * Include this file at the top of every API endpoint
 */

// Allow requests from frontend origin
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/**
 * Send JSON response
 * @param bool $success
 * @param string $message
 * @param array $data
 * @param int $statusCode
 */
function sendResponse($success, $message, $data = [], $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit();
}

/**
 * Send error response
 * @param string $message
 * @param int $statusCode
 */
function sendError($message, $statusCode = 400) {
    sendResponse(false, $message, [], $statusCode);
}

/**
 * Get JSON input from request body
 * @return array
 */
function getJsonInput() {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    return $data ?? [];
}
?>
