import { mockProducts, mockOrders } from '../data/mockProducts'

// API base URL - change this when running with PHP backend
const API_BASE_URL = 'http://localhost/rehan-bakery-shop/backend/api'

// Check if we should use mock data (PHP backend not available)
const USE_MOCK = true // Set to false when using PHP backend

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  if (USE_MOCK) {
    return handleMockRequest(endpoint, options)
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })
    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    // Fallback to mock data if API fails
    return handleMockRequest(endpoint, options)
  }
}

// Mock request handler for v0 preview
function handleMockRequest(endpoint, options = {}) {
  const method = options.method || 'GET'
  const body = options.body ? JSON.parse(options.body) : null

  // Products endpoints
  if (endpoint === 'products.php' || endpoint.startsWith('products.php?')) {
    const url = new URL(`http://localhost/${endpoint}`)
    const category = url.searchParams.get('category')
    const search = url.searchParams.get('search')
    
    let filtered = [...mockProducts]
    
    if (category && category !== 'All') {
      filtered = filtered.filter(p => p.category === category)
    }
    
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      )
    }
    
    return Promise.resolve({ success: true, data: filtered })
  }

  if (endpoint.startsWith('product.php?id=')) {
    const id = parseInt(endpoint.split('=')[1])
    const product = mockProducts.find(p => p.id === id)
    if (product) {
      return Promise.resolve({ success: true, data: product })
    }
    return Promise.resolve({ success: false, message: 'Product not found' })
  }

  // Auth endpoints
  if (endpoint === 'login.php' && method === 'POST') {
    const { email, password } = body
    // Mock admin login
    if ((email === 'admin@bakery.com' || email === 'admin@rehanbakery.com') && (password === 'admin123' || password === 'Admin@123')) {
      return Promise.resolve({
        success: true,
        user: { id: 1, name: 'Admin User', email, role: 'admin', phone: '9876543210', address: 'Rehan Bakery Main Branch' }
      })
    }
    // Mock customer login
    if ((email === 'user@example.com' || email === 'customer@rehanbakery.com') && (password === 'user123' || password === 'Customer@123')) {
      return Promise.resolve({
        success: true,
        user: { id: 2, name: 'Test User', email, role: 'customer', phone: '9876543211', address: 'Bhopal, MP' }
      })
    }
    // Mock delivery login
    if ((email === 'delivery@bakery.com' || email === 'worker@rehanbakery.com') && (password === 'delivery123' || password === 'Worker@123')) {
      return Promise.resolve({
        success: true,
        user: { id: 3, name: 'Delivery Partner', email, role: 'delivery', phone: '9876543212', address: 'Delivery Zone 1' }
      })
    }
    return Promise.resolve({ success: false, message: 'Invalid email or password' })
  }

  if (endpoint === 'register.php' && method === 'POST') {
    const { name, email } = body
    const role = 'customer'
    // Public registration always creates a user/customer account
    return Promise.resolve({
      success: true,
      message: 'Registration successful! You can now login.',
      user: { id: Date.now(), name, email, role }
    })
  }


  if (endpoint === 'forgot-password.php' && method === 'POST') {
    const { email } = body
    if (!email) {
      return Promise.resolve({ success: false, message: 'Email is required' })
    }
    return Promise.resolve({
      success: true,
      message: 'Password reset link generated successfully',
      data: {
        reset_link: `http://localhost:5173/reset-password?token=demo-${Date.now()}`,
        note: 'Demo mode: production me ye email par send hoga.'
      }
    })
  }

  // Order endpoints
  if (endpoint === 'place-order.php' && method === 'POST') {
    return Promise.resolve({
      success: true,
      message: 'Order placed successfully!',
      order_id: Date.now()
    })
  }

  if (endpoint === 'orders.php') {
    return Promise.resolve({ success: true, data: mockOrders })
  }

  // Admin product management (mock)
  if (endpoint === 'add-product.php' && method === 'POST') {
    const newProduct = { ...body, id: Date.now(), status: 'available' }
    mockProducts.push(newProduct)
    return Promise.resolve({ success: true, message: 'Product added successfully', data: newProduct })
  }

  if (endpoint === 'update-product.php' && method === 'PUT') {
    const index = mockProducts.findIndex(p => p.id === body.id)
    if (index !== -1) {
      mockProducts[index] = { ...mockProducts[index], ...body }
      return Promise.resolve({ success: true, message: 'Product updated successfully' })
    }
    return Promise.resolve({ success: false, message: 'Product not found' })
  }

  if (endpoint === 'delete-product.php' && method === 'DELETE') {
    const id = body.id
    const index = mockProducts.findIndex(p => p.id === id)
    if (index !== -1) {
      mockProducts.splice(index, 1)
      return Promise.resolve({ success: true, message: 'Product deleted successfully' })
    }
    return Promise.resolve({ success: false, message: 'Product not found' })
  }

  return Promise.resolve({ success: false, message: 'Unknown endpoint' })
}

// API Functions
export async function getProducts(category = null, search = null) {
  let endpoint = 'products.php'
  const params = new URLSearchParams()
  if (category && category !== 'All') params.append('category', category)
  if (search) params.append('search', search)
  if (params.toString()) endpoint += '?' + params.toString()
  return apiCall(endpoint)
}

export async function getProduct(id) {
  return apiCall(`product.php?id=${id}`)
}

export async function login(email, password) {
  return apiCall('login.php', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
}

export async function register(userData) {
  return apiCall('register.php', {
    method: 'POST',
    body: JSON.stringify(userData)
  })
}

export async function placeOrder(orderData) {
  return apiCall('place-order.php', {
    method: 'POST',
    body: JSON.stringify(orderData)
  })
}

export async function getOrders() {
  return apiCall('orders.php')
}

export async function addProduct(productData) {
  return apiCall('add-product.php', {
    method: 'POST',
    body: JSON.stringify(productData)
  })
}

export async function updateProduct(productData) {
  return apiCall('update-product.php', {
    method: 'PUT',
    body: JSON.stringify(productData)
  })
}

export async function deleteProduct(id) {
  return apiCall('delete-product.php', {
    method: 'DELETE',
    body: JSON.stringify({ id })
  })
}


export async function forgotPassword(email) {
  return apiCall('forgot-password.php', {
    method: 'POST',
    body: JSON.stringify({ email })
  })
}
