import { ArrowLeft, CheckCircle2, MessageCircle, ShoppingBag } from 'lucide-react'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import ProductLogo from '../components/ProductLogo.jsx'
import { durationLabels } from '../data/products.js'

export default function ProductDetailPage({ product, products, setTheme, theme }) {
  const availabilityClass = product.availability?.toLowerCase().replaceAll(' ', '-')
  const relatedProducts = products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 3)

  return (
    <main className={`site-shell detail-shell theme-${theme}`}>
      <Navbar setTheme={setTheme} theme={theme} />
      <section className="detail-page">
        <a className="back-link" href="/#plans">
          <ArrowLeft size={18} aria-hidden="true" />
          Back to catalog
        </a>
        <div className="detail-grid">
          <div className="detail-visual">
            <ProductLogo product={product} />
            <span className={`availability ${availabilityClass}`}>
              {product.availability}
            </span>
          </div>
          <div className="detail-copy">
            <span className={`plan-badge ${product.tone}`}>{product.category}</span>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <div className="detail-price-row">
              <strong>
                {product.price > 0
                  ? `BDT ${product.price.toLocaleString()}`
                  : 'Ask for price'}
              </strong>
              <span>{durationLabels[product.duration]} - {product.tag}</span>
            </div>
            {(product.globalPrice || product.threeMonthPrice) && (
              <div className="multi-price-row">
                {product.globalPrice && (
                  <span>Global BDT {product.globalPrice.toLocaleString()}</span>
                )}
                {product.threeMonthPrice && (
                  <span>3 Months BDT {product.threeMonthPrice.toLocaleString()}</span>
                )}
              </div>
            )}
            <ul>
              {product.features.map((feature) => (
                <li key={feature}>
                  <CheckCircle2 size={17} aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="detail-actions">
              <a className="primary-link" href={`/checkout?id=${product.id}`}>
                <ShoppingBag size={18} aria-hidden="true" />
                Checkout
              </a>
              <a className="secondary-link" href="https://wa.me/8801580744443">
                <MessageCircle size={18} aria-hidden="true" />
                Ask on WhatsApp
              </a>
            </div>
          </div>
        </div>
        <section className="related-strip" aria-label="Similar subscriptions">
          {relatedProducts.map((item) => (
            <a href={`/product?id=${item.id}`} key={item.id}>
              <span>{item.name}</span>
              <strong>{item.availability}</strong>
            </a>
          ))}
        </section>
      </section>
      <Footer />
    </main>
  )
}
