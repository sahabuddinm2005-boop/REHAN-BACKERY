<?php
/**
 * Update Product API (Admin Only)
 * PUT /api/update-product.php
 */

require_once '../config/db.php';
setCorsHeaders();

// Only accept PUT requests
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

// Get input data
$data = getJsonInput();

// Validate product ID
if (!isset($data['id']) || !is_numeric($data['id'])) {
    jsonResponse(['success' => false, 'message' => 'Valid product ID is required'], 400);
}

$productId = (int)$data['id'];

try {
    $pdo = getConnection();
    
    // Check if product exists
    $stmt = $pdo->prepare("SELECT id FROM products WHERE id = ?");
    $stmt->execute([$productId]);
    
    if (!$stmt->fetch()) {
        jsonResponse(['success' => false, 'message' => 'Product not found'], 404);
    }
    
    // Build update query dynamically based on provided fields
    $updates = [];
    $params = [];
    
    $allowedFields = ['name', 'description', 'price', 'category', 'image', 'stock', 'status'];
    
    foreach ($allowedFields as $field) {
        if (isset($data[$field])) {
            $updates[] = "$field = ?";
            
            switch ($field) {
                case 'price':
                    $params[] = (float)$data[$field];
                    break;
                case 'stock':
                    $params[] = (int)$data[$field];
                    break;
                case 'category':
                    $validCategories = ['Cakes', 'Pastries', 'Breads', 'Cookies'];
                    if (!in_array($data[$field], $validCategories)) {
                        jsonResponse([
                            'success' => false,
                            'message' => 'Invalid category'
                        ], 400);
                    }
                    $params[] = sanitize($data[$field]);
                    break;
                case 'status':
                    $validStatuses = ['available', 'unavailable'];
                    if (!in_array($data[$field], $validStatuses)) {
                        $params[] = 'available';
                    } else {
                        $params[] = sanitize($data[$field]);
                    }
                    break;
                case 'image':
                    $params[] = filter_var($data[$field], FILTER_SANITIZE_URL);
                    break;
                default:
                    $params[] = sanitize($data[$field]);
            }
        }
    }
    
    if (empty($updates)) {
        jsonResponse(['success' => false, 'message' => 'No fields to update'], 400);
    }
    
    // Add product ID to params
    $params[] = $productId;
    
    $sql = "UPDATE products SET " . implode(', ', $updates) . " WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    // Fetch updated product
    $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->execute([$productId]);
    $product = $stmt->fetch();
    
    $product['price'] = (float)$product['price'];
    $product['stock'] = (int)$product['stock'];
    $product['id'] = (int)$product['id'];
    
    jsonResponse([
        'success' => true,
        'message' => 'Product updated successfully',
        'data' => $product
    ]);
    
} catch (PDOException $e) {
    jsonResponse([
        'success' => false,
        'message' => 'Failed to update product: ' . $e->getMessage()
    ], 500);
}
?>
