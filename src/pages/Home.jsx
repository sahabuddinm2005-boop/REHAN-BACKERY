import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../api/api'
import ProductCard from '../components/ProductCard'
import { ArrowRight, Cake, Cookie, Croissant, Wheat, Clock, Award, Truck, Phone, Mail, MapPin } from 'lucide-react'

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const response = await getProducts()
        if (response.success) {
          // Get 4 featured products (one from each category)
          const categories = ['Cakes', 'Pastries', 'Breads', 'Cookies']
          const featured = categories.map(cat => 
            response.data.find(p => p.category === cat)
          ).filter(Boolean)
          setFeaturedProducts(featured)
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  const categories = [
    { name: 'Cakes', icon: Cake, description: 'Birthday, wedding, and custom cakes' },
    { name: 'Pastries', icon: Croissant, description: 'Croissants, danish, and tarts' },
    { name: 'Breads', icon: Wheat, description: 'Fresh baked artisan breads' },
    { name: 'Cookies', icon: Cookie, description: 'Cookies and macarons' }
  ]

  const features = [
    { icon: Clock, title: 'Fresh Daily', description: 'All items baked fresh every morning' },
    { icon: Award, title: 'Quality Ingredients', description: 'Only the finest, natural ingredients' },
    { icon: Truck, title: 'Fast Delivery', description: 'Same-day delivery available' }
  ]

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Welcome to Rehan Bakery</h1>
            <p className="hero-subtitle">
              Crafting delicious memories with fresh, artisan baked goods made with love since 2010
            </p>
            <div className="hero-buttons">
              <Link to="/products" className="btn btn-highlight btn-lg">
                Shop Now
                <ArrowRight size={20} />
              </Link>
              <a href="#about" className="btn btn-secondary btn-lg">Learn More</a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <feature.icon size={32} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Categories</h2>
            <p>Explore our wide range of freshly baked goods</p>
          </div>
          <div className="categories-grid">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${category.name}`}
                className="category-card"
              >
                <div className="category-icon">
                  <category.icon size={48} />
                </div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <span className="category-link">
                  Browse {category.name}
                  <ArrowRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <p>Our most popular items, freshly baked for you</p>
          </div>
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
          ) : (
            <>
              <div className="products-grid grid grid-4">
                {featuredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="text-center mt-5">
                <Link to="/products" className="btn btn-primary btn-lg">
                  View All Products
                  <ArrowRight size={20} />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section about-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-image">
              <img
                src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=600&h=500&fit=crop"
                alt="Bakery interior"
              />
            </div>
            <div className="about-content">
              <h2>Our Story</h2>
              <p>
                Since 2010, Rehan Bakery has been serving the community with fresh, 
                handcrafted baked goods made from the finest ingredients. What started 
                as a small family bakery has grown into a beloved local institution.
              </p>
              <p>
                Every item is baked fresh daily using traditional recipes passed down 
                through generations, combined with modern techniques to ensure consistent 
                quality and delicious taste in every bite.
              </p>
              <p>
                We take pride in using only natural, high-quality ingredients with no 
                artificial preservatives. From our famous sourdough bread to our decadent 
                chocolate cakes, every product is made with love and attention to detail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section contact-section">
        <div className="container">
          <div className="section-header">
            <h2>Visit Us</h2>
            <p>We would love to see you at our bakery</p>
          </div>
          <div className="contact-grid">
            <div className="contact-card">
              <MapPin size={28} />
              <h3>Location</h3>
              <p>123 Bakery Street<br />Sweet Town, ST 12345</p>
            </div>
            <div className="contact-card">
              <Clock size={28} />
              <h3>Hours</h3>
              <p>Mon-Sat: 7am - 8pm<br />Sunday: 8am - 6pm</p>
            </div>
            <div className="contact-card">
              <Phone size={28} />
              <h3>Phone</h3>
              <p>(555) 123-4567</p>
            </div>
            <div className="contact-card">
              <Mail size={28} />
              <h3>Email</h3>
              <p>hello@rehanbakery.com</p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        /* Hero Section */
        .hero {
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
          padding: 6rem 0;
          text-align: center;
        }

        .hero-content {
          max-width: 700px;
          margin: 0 auto;
        }

        .hero h1 {
          color: var(--color-white);
          font-size: 3rem;
          margin-bottom: 1.5rem;
        }

        .hero-subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.25rem;
          line-height: 1.7;
          margin-bottom: 2rem;
        }

        .hero-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (min-width: 768px) {
          .hero {
            padding: 8rem 0;
          }
          .hero h1 {
            font-size: 4rem;
          }
        }

        /* Features Section */
        .features-section {
          background-color: var(--color-white);
          padding: 3rem 0;
          margin-top: -2rem;
          position: relative;
          z-index: 10;
          border-radius: var(--radius-lg) var(--radius-lg) 0 0;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 2rem;
        }

        @media (min-width: 768px) {
          .features-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .feature-card {
          text-align: center;
          padding: 1.5rem;
        }

        .feature-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          background-color: var(--color-secondary);
          color: var(--color-primary);
          border-radius: var(--radius-full);
          margin-bottom: 1rem;
        }

        .feature-card h3 {
          margin-bottom: 0.5rem;
        }

        .feature-card p {
          color: var(--color-text-light);
          margin: 0;
        }

        /* Categories Section */
        .categories-section {
          background-color: var(--color-secondary);
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 1.5rem;
        }

        @media (min-width: 640px) {
          .categories-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .categories-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .category-card {
          background-color: var(--color-white);
          padding: 2rem;
          border-radius: var(--radius-lg);
          text-align: center;
          text-decoration: none;
          box-shadow: var(--shadow-md);
          transition: all 0.3s ease;
        }

        .category-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-lg);
        }

        .category-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
          color: var(--color-white);
          border-radius: var(--radius-full);
          margin-bottom: 1.25rem;
        }

        .category-card h3 {
          color: var(--color-accent);
          margin-bottom: 0.5rem;
        }

        .category-card p {
          color: var(--color-text-light);
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .category-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-primary);
          font-weight: 600;
          font-size: 0.875rem;
        }

        .category-card:hover .category-link {
          gap: 0.75rem;
        }

        /* Featured Section */
        .featured-section {
          background-color: var(--color-white);
        }

        .products-grid {
          margin-bottom: 2rem;
        }

        /* About Section */
        .about-section {
          background-color: var(--color-secondary);
        }

        .about-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: center;
        }

        @media (min-width: 1024px) {
          .about-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .about-image {
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-lg);
        }

        .about-image img {
          width: 100%;
          height: auto;
          display: block;
        }

        .about-content h2 {
          margin-bottom: 1.5rem;
        }

        .about-content p {
          color: var(--color-text-light);
          line-height: 1.8;
        }

        /* Contact Section */
        .contact-section {
          background-color: var(--color-white);
        }

        .contact-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 1.5rem;
        }

        @media (min-width: 640px) {
          .contact-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .contact-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .contact-card {
          background-color: var(--color-secondary);
          padding: 2rem;
          border-radius: var(--radius-lg);
          text-align: center;
        }

        .contact-card svg {
          color: var(--color-primary);
          margin-bottom: 1rem;
        }

        .contact-card h3 {
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }

        .contact-card p {
          color: var(--color-text-light);
          font-size: 0.875rem;
          margin: 0;
          line-height: 1.6;
        }
      `}</style>
    </div>
  )
}

export default Home
