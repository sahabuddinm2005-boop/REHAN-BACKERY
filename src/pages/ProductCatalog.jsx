import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProducts } from '../api/api'
import ProductCard from '../components/ProductCard'
import { categories } from '../data/mockProducts'
import { Search, Package } from 'lucide-react'

function ProductCatalog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  const selectedCategory = searchParams.get('category') || 'All'

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory])

  async function fetchProducts() {
    setLoading(true)
    setError(null)
    try {
      const response = await getProducts(selectedCategory, searchTerm || null)
      if (response.success) {
        setProducts(response.data)
      } else {
        setError(response.message || 'Failed to load products')
      }
    } catch (err) {
      setError('Failed to load products. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (category) => {
    if (category === 'All') {
      searchParams.delete('category')
    } else {
      searchParams.set('category', category)
    }
    setSearchParams(searchParams)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchProducts()
  }

  const filteredProducts = products.filter(product => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term)
    )
  })

  return (
    <div className="product-catalog">
      <div className="page-header">
        <h1>Our Products</h1>
      </div>

      <div className="container">
        {/* Filters Section */}
        <div className="filters-section">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
          </form>

          {/* Category Filters */}
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="results-info">
          <p>
            {loading ? 'Loading...' : `Showing ${filteredProducts.length} products`}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <Package size={80} />
            <h3>No Products Found</h3>
            <p>
              {searchTerm
                ? `No products match "${searchTerm}". Try a different search term.`
                : 'No products available in this category yet.'}
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                handleCategoryChange('All')
              }}
              className="btn btn-primary"
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className="products-grid grid grid-4">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .product-catalog {
          padding-bottom: 4rem;
        }

        .filters-section {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background-color: var(--color-white);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
        }

        .search-form {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .search-input-wrapper {
          flex: 1;
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-light);
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          font-size: 1rem;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          transition: border-color 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--color-primary);
        }

        @media (max-width: 640px) {
          .search-form {
            flex-direction: column;
          }
        }

        .category-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .category-btn {
          padding: 0.5rem 1.25rem;
          font-size: 0.875rem;
          font-weight: 500;
          background-color: var(--color-secondary);
          color: var(--color-text);
          border: 2px solid transparent;
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .category-btn:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .category-btn.active {
          background-color: var(--color-primary);
          color: var(--color-white);
        }

        .results-info {
          margin-bottom: 1.5rem;
        }

        .results-info p {
          color: var(--color-text-light);
          margin: 0;
        }

        .products-grid {
          margin-bottom: 2rem;
        }
      `}</style>
    </div>
  )
}

export default ProductCatalog
