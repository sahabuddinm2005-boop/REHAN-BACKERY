import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getProducts, getOrders, addProduct, updateProduct, deleteProduct } from '../api/api'
import ProductForm from '../components/ProductForm'
import { Plus, Edit, Trash2, Package, ShoppingBag, DollarSign, Users, AlertTriangle } from 'lucide-react'

function AdminDashboard() {
  const navigate = useNavigate()
  const { user, isAdmin, isAuthenticated } = useAuth()
  
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (!isAdmin) {
      navigate('/')
      return
    }
    fetchData()
  }, [isAuthenticated, isAdmin, navigate])

  async function fetchData() {
    setLoading(true)
    setError(null)
    try {
      const [productsRes, ordersRes] = await Promise.all([
        getProducts(),
        getOrders()
      ])
      
      if (productsRes.success) setProducts(productsRes.data)
      if (ordersRes.success) setOrders(ordersRes.data)
    } catch (err) {
      setError('Failed to load data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async (productData) => {
    try {
      const response = await addProduct(productData)
      if (response.success) {
        setProducts(prev => [response.data, ...prev])
        setShowProductForm(false)
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError('Failed to add product')
    }
  }

  const handleUpdateProduct = async (productData) => {
    try {
      const response = await updateProduct(productData)
      if (response.success) {
        setProducts(prev =>
          prev.map(p => p.id === productData.id ? { ...p, ...productData } : p)
        )
        setEditingProduct(null)
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError('Failed to update product')
    }
  }

  const handleDeleteProduct = async (id) => {
    try {
      const response = await deleteProduct(id)
      if (response.success) {
        setProducts(prev => prev.filter(p => p.id !== id))
        setDeleteConfirm(null)
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError('Failed to delete product')
    }
  }

  // Calculate stats
  const totalProducts = products.length
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0)
  const lowStockProducts = products.filter(p => p.stock <= 5).length

  const stats = [
    { icon: Package, label: 'Total Products', value: totalProducts, color: 'primary' },
    { icon: ShoppingBag, label: 'Total Orders', value: totalOrders, color: 'highlight' },
    { icon: DollarSign, label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, color: 'success' },
    { icon: AlertTriangle, label: 'Low Stock', value: lowStockProducts, color: 'error' }
  ]

  if (!isAdmin) {
    return null
  }

  return (
    <div className="admin-dashboard">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
      </div>

      <div className="container">
        {/* Stats Cards */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className={`stat-card stat-${stat.color}`}>
              <div className="stat-icon">
                <stat.icon size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">{stat.label}</p>
                <p className="stat-value">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error">
            {error}
            <button onClick={() => setError(null)} className="alert-close">&times;</button>
          </div>
        )}

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={18} />
            Products
          </button>
          <button
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingBag size={18} />
            Orders
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            {/* Products Tab */}
            {activeTab === 'products' && (
              <div className="admin-section">
                <div className="section-header-row">
                  <h2>Products Management</h2>
                  <button
                    onClick={() => setShowProductForm(true)}
                    className="btn btn-primary"
                  >
                    <Plus size={18} />
                    Add Product
                  </button>
                </div>

                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(product => (
                        <tr key={product.id}>
                          <td>
                            <img
                              src={product.image}
                              alt={product.name}
                              className="product-thumbnail"
                            />
                          </td>
                          <td>
                            <span className="product-name">{product.name}</span>
                          </td>
                          <td>
                            <span className="badge badge-primary">{product.category}</span>
                          </td>
                          <td>${product.price.toFixed(2)}</td>
                          <td>
                            <span className={product.stock <= 5 ? 'text-error' : ''}>
                              {product.stock}
                              {product.stock <= 5 && ' (Low)'}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${product.status === 'available' ? 'badge-success' : 'badge-error'}`}>
                              {product.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                onClick={() => setEditingProduct(product)}
                                className="action-btn edit"
                                aria-label="Edit product"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(product)}
                                className="action-btn delete"
                                aria-label="Delete product"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="admin-section">
                <div className="section-header-row">
                  <h2>Orders Management</h2>
                </div>

                {orders.length === 0 ? (
                  <div className="empty-state">
                    <ShoppingBag size={60} />
                    <h3>No Orders Yet</h3>
                    <p>Orders will appear here when customers place them.</p>
                  </div>
                ) : (
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Email</th>
                          <th>Total</th>
                          <th>Payment</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(order => (
                          <tr key={order.id}>
                            <td>#{order.id}</td>
                            <td>{order.customer_name}</td>
                            <td>{order.customer_email}</td>
                            <td>${order.total_amount.toFixed(2)}</td>
                            <td>{order.payment_method}</td>
                            <td>
                              <span className={`badge badge-${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                            <td>{new Date(order.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Product Form Modal */}
      {(showProductForm || editingProduct) && (
        <ProductForm
          product={editingProduct}
          onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
          onCancel={() => {
            setShowProductForm(false)
            setEditingProduct(null)
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>Delete Product</h3>
            <p>Are you sure you want to delete "{deleteConfirm.name}"? This action cannot be undone.</p>
            <div className="confirm-actions">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirm.id)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-dashboard {
          padding-bottom: 4rem;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        @media (min-width: 640px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background-color: var(--color-white);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
        }

        .stat-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          border-radius: var(--radius-md);
        }

        .stat-primary .stat-icon {
          background-color: rgba(139, 69, 19, 0.1);
          color: var(--color-primary);
        }

        .stat-highlight .stat-icon {
          background-color: rgba(255, 140, 0, 0.1);
          color: var(--color-highlight);
        }

        .stat-success .stat-icon {
          background-color: rgba(34, 197, 94, 0.1);
          color: var(--color-success);
        }

        .stat-error .stat-icon {
          background-color: rgba(239, 68, 68, 0.1);
          color: var(--color-error);
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--color-text-light);
          margin: 0 0 0.25rem;
        }

        .stat-value {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-accent);
          margin: 0;
        }

        /* Alert */
        .alert {
          position: relative;
        }

        .alert-close {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          opacity: 0.7;
        }

        .alert-close:hover {
          opacity: 1;
        }

        /* Tabs */
        .admin-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          border-bottom: 2px solid var(--color-border);
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          font-weight: 500;
          color: var(--color-text-light);
          background: none;
          border: none;
          cursor: pointer;
          position: relative;
          transition: color 0.2s ease;
        }

        .tab-btn:hover {
          color: var(--color-text);
        }

        .tab-btn.active {
          color: var(--color-primary);
        }

        .tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background-color: var(--color-primary);
        }

        /* Section */
        .admin-section {
          background-color: var(--color-white);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          padding: 1.5rem;
        }

        .section-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .section-header-row h2 {
          margin: 0;
        }

        /* Table */
        .product-thumbnail {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: var(--radius-sm);
        }

        .product-name {
          font-weight: 500;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-btn.edit {
          background-color: rgba(139, 69, 19, 0.1);
          color: var(--color-primary);
        }

        .action-btn.edit:hover {
          background-color: var(--color-primary);
          color: var(--color-white);
        }

        .action-btn.delete {
          background-color: rgba(239, 68, 68, 0.1);
          color: var(--color-error);
        }

        .action-btn.delete:hover {
          background-color: var(--color-error);
          color: var(--color-white);
        }

        /* Confirm Modal */
        .confirm-modal {
          background-color: var(--color-white);
          border-radius: var(--radius-lg);
          padding: 2rem;
          width: 100%;
          max-width: 400px;
          text-align: center;
        }

        .confirm-modal h3 {
          margin-bottom: 1rem;
        }

        .confirm-modal p {
          color: var(--color-text-light);
          margin-bottom: 1.5rem;
        }

        .confirm-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }
      `}</style>
    </div>
  )
}

function getStatusColor(status) {
  switch (status) {
    case 'completed': return 'success'
    case 'pending': return 'highlight'
    case 'processing': return 'primary'
    case 'cancelled': return 'error'
    default: return 'primary'
  }
}

export default AdminDashboard
