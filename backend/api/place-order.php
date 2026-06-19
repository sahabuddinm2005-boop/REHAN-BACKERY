<?php
/**
 * Place Order API with Stock Management, Coupons, and Delivery Charges
 * POST /api/place-order.php
 */

require_once '../config/cors.php';
require_once '../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

$data = getJsonInput();

// Validate required fields
$user_id = isset($data['user_id']) ? intval($data['user_id']) : 0;
$customer_name = isset($data['customer_name']) ? trim($data['customer_name']) : '';
$phone = isset($data['phone']) ? trim($data['phone']) : '';
$address = isset($data['address']) ? trim($data['address']) : '';
$payment_method = isset($data['payment_method']) ? trim($data['payment_method']) : 'cod';
$coupon_code = isset($data['coupon_code']) ? strtoupper(trim($data['coupon_code'])) : null;
$items = isset($data['items']) ? $data['items'] : [];

if ($user_id <= 0) {
    sendError('User ID is required');
}

if (empty($customer_name)) {
    sendError('Customer name is required');
}

if (empty($phone)) {
    sendError('Phone number is required');
}

if (empty($address)) {
    sendError('Address is required');
}

if (empty($items) || !is_array($items)) {
    sendError('Order items are required');
}

try {
    $db = new Database();
    $conn = $db->getConnection();
    
    // Start transaction
    $conn->beginTransaction();
    
    $total_amount = 0;
    $order_items = [];
    
    // Validate and process each item
    foreach ($items as $item) {
        $product_id = isset($item['id']) ? intval($item['id']) : 0;
        $quantity = isset($item['quantity']) ? intval($item['quantity']) : 0;
        
        if ($product_id <= 0 || $quantity <= 0) {
            throw new Exception('Invalid item data');
        }
        
        // Get product details
        $stmt = $conn->prepare("SELECT id, name, price, stock FROM products WHERE id = :id FOR UPDATE");
        $stmt->bindParam(':id', $product_id, PDO::PARAM_INT);
        $stmt->execute();
        $product = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$product) {
            throw new Exception("Product not found: ID $product_id");
        }
        
        // Check stock
        if ($product['stock'] < $quantity) {
            throw new Exception("Insufficient stock for '{$product['name']}'. Available: {$product['stock']}");
        }
        
        $subtotal = $product['price'] * $quantity;
        $total_amount += $subtotal;
        
        $order_items[] = [
            'product_id' => $product['id'],
            'product_name' => $product['name'],
            'quantity' => $quantity,
            'price' => $product['price'],
            'subtotal' => $subtotal
        ];
        
        // Deduct stock
        $new_stock = $product['stock'] - $quantity;
        $updateStmt = $conn->prepare("UPDATE products SET stock = :stock WHERE id = :id");
        $updateStmt->bindParam(':stock', $new_stock, PDO::PARAM_INT);
        $updateStmt->bindParam(':id', $product['id'], PDO::PARAM_INT);
        $updateStmt->execute();
    }
    
    // Calculate delivery charge (free for orders >= 500)
    $delivery_charge = $total_amount >= 500 ? 0 : 40;
    
    // Apply coupon if provided
    $discount_amount = 0;
    if (!empty($coupon_code)) {
        $couponStmt = $conn->prepare("SELECT * FROM coupons WHERE code = :code AND status = 'active'");
        $couponStmt->bindParam(':code', $coupon_code);
        $couponStmt->execute();
        $coupon = $couponStmt->fetch(PDO::FETCH_ASSOC);
        
        if ($coupon) {
            // Check expiry
            if (empty($coupon['expiry_date']) || strtotime($coupon['expiry_date']) >= strtotime('today')) {
                // Check minimum order
                if ($total_amount >= $coupon['min_order_amount']) {
                    if ($coupon['discount_type'] === 'percentage') {
                        $discount_amount = ($total_amount * $coupon['discount_value']) / 100;
                    } else {
                        $discount_amount = $coupon['discount_value'];
                    }
                    $discount_amount = min($discount_amount, $total_amount);
                }
            }
        }
    }
    
    // Calculate final amount
    $final_amount = $total_amount - $discount_amount + $delivery_charge;
    
    // Set payment status
    $payment_status = 'pending';
    if ($payment_method === 'online') {
        $payment_status = 'pending'; // Would be updated after payment gateway callback
    }
    
    // Insert order
    $orderStmt = $conn->prepare("
        INSERT INTO orders (
            user_id, customer_name, phone, address, total_amount,
            coupon_code, discount_amount, delivery_charge, final_amount,
            payment_method, payment_status, order_status
        ) VALUES (
            :user_id, :customer_name, :phone, :address, :total_amount,
            :coupon_code, :discount_amount, :delivery_charge, :final_amount,
            :payment_method, :payment_status, 'pending'
        )
    ");
    $orderStmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
    $orderStmt->bindParam(':customer_name', $customer_name);
    $orderStmt->bindParam(':phone', $phone);
    $orderStmt->bindParam(':address', $address);
    $orderStmt->bindParam(':total_amount', $total_amount);
    $orderStmt->bindParam(':coupon_code', $coupon_code);
    $orderStmt->bindParam(':discount_amount', $discount_amount);
    $orderStmt->bindParam(':delivery_charge', $delivery_charge);
    $orderStmt->bindParam(':final_amount', $final_amount);
    $orderStmt->bindParam(':payment_method', $payment_method);
    $orderStmt->bindParam(':payment_status', $payment_status);
    $orderStmt->execute();
    
    $order_id = $conn->lastInsertId();
    
    // Insert order items
    $itemStmt = $conn->prepare("
        INSERT INTO order_items (order_id, product_id, product_name, quantity, price, subtotal)
        VALUES (:order_id, :product_id, :product_name, :quantity, :price, :subtotal)
    ");
    
    foreach ($order_items as $item) {
        $itemStmt->bindParam(':order_id', $order_id, PDO::PARAM_INT);
        $itemStmt->bindParam(':product_id', $item['product_id'], PDO::PARAM_INT);
        $itemStmt->bindParam(':product_name', $item['product_name']);
        $itemStmt->bindParam(':quantity', $item['quantity'], PDO::PARAM_INT);
        $itemStmt->bindParam(':price', $item['price']);
        $itemStmt->bindParam(':subtotal', $item['subtotal']);
        $itemStmt->execute();
    }
    
    // Commit transaction
    $conn->commit();
    
    sendResponse(true, 'Order placed successfully!', [
        'order_id' => $order_id,
        'total_amount' => round($total_amount, 2),
        'discount_amount' => round($discount_amount, 2),
        'delivery_charge' => round($delivery_charge, 2),
        'final_amount' => round($final_amount, 2)
    ], 201);
    
} catch (Exception $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    sendError($e->getMessage(), 400);
}
?>
