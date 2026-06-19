<?php
/**
 * Image Upload API
 * POST /api/upload-image.php
 */

require_once '../config/cors.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

// Check if file was uploaded
if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    $error_messages = [
        UPLOAD_ERR_INI_SIZE => 'File exceeds upload_max_filesize',
        UPLOAD_ERR_FORM_SIZE => 'File exceeds MAX_FILE_SIZE',
        UPLOAD_ERR_PARTIAL => 'File was only partially uploaded',
        UPLOAD_ERR_NO_FILE => 'No file was uploaded',
        UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
        UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
        UPLOAD_ERR_EXTENSION => 'A PHP extension stopped the file upload'
    ];
    $error_code = $_FILES['image']['error'] ?? UPLOAD_ERR_NO_FILE;
    sendError($error_messages[$error_code] ?? 'Unknown upload error');
}

$file = $_FILES['image'];
$allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
$max_size = 2 * 1024 * 1024; // 2MB

// Validate file type
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$file_type = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($file_type, $allowed_types)) {
    sendError('Invalid file type. Only JPG, JPEG, PNG, and WEBP are allowed.');
}

// Validate file size
if ($file['size'] > $max_size) {
    sendError('File size exceeds 2MB limit.');
}

// Create uploads directory if it doesn't exist
$upload_dir = '../uploads/';
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

// Generate unique filename
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = uniqid('product_', true) . '.' . $extension;
$destination = $upload_dir . $filename;

// Move uploaded file
if (move_uploaded_file($file['tmp_name'], $destination)) {
    $image_url = '/backend/uploads/' . $filename;
    sendResponse(true, 'Image uploaded successfully', [
        'image_url' => $image_url,
        'filename' => $filename
    ]);
} else {
    sendError('Failed to save uploaded file', 500);
}
?>
