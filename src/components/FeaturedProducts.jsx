import { Crown, ShoppingBag } from 'lucide-react'
import { durationLabels, featuredProductNames } from '../data/products.js'
import ProductLogo from './ProductLogo.jsx'

export default function FeaturedProducts({ products }) {
  const featuredProducts = featuredProductNames
    .map((name) => products.find((product) => product.name === name))
    .filter(Boolean)

  return (
    <section className="featured-section" id="featured">
      <div className="section-heading">
        <span>Best sellers</span>
        <h2>The crowd-favorite passes.</h2>
      </div>

      <div className="featured-grid">
        {featuredProducts.map((product, index) => (
          <article className="featured-card" key={product.id}>
            <span className="featured-rank">
              <Crown size={17} aria-hidden="true" />
              #{index + 1}
            </span>
            <ProductLogo product={product} />
            <div>
              <p>{product.category}</p>
              <h3>{product.name}</h3>
              <strong>
                {product.price > 0
                  ? `BDT ${product.price.toLocaleString()}`
                  : 'Ask for price'}
              </strong>
              <small>{durationLabels[product.duration]} - {product.tag}</small>
            </div>
            <a href={`/checkout?id=${product.id}`}>
              <ShoppingBag size={17} aria-hidden="true" />
              Order
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}
