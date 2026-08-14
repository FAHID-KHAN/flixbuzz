import { CheckCircle2, ShoppingBag, TicketCheck } from 'lucide-react'
import ProductLogo from './ProductLogo.jsx'

export default function ProductCard({
  durationLabel,
  isSelected,
  product,
  setSelectedId,
}) {
  const availabilityClass = product.availability?.toLowerCase().replaceAll(' ', '-')

  return (
    <article className={`plan-card ${isSelected ? 'active' : ''}`}>
      <a
        className="plan-pick-zone"
        href={`/product?id=${product.id}`}
      >
        <ProductLogo product={product} />
        <div className="card-topline">
          <span className={`plan-badge ${product.tone}`}>{product.category}</span>
          <span className={`availability ${availabilityClass}`}>
            {product.availability}
          </span>
          <span className="vibe-meter" aria-label={`${product.tag} vibe`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </div>
        <h3>{product.name}</h3>
        <strong>
          {product.price > 0
            ? `BDT ${product.price.toLocaleString()}`
            : 'Ask for price'}
        </strong>
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
        <p>
          {durationLabel} verified subscription - {product.tag}
        </p>
        <span className="product-description">{product.description}</span>
        <ul>
          {product.features.map((feature) => (
            <li key={feature}>
              <CheckCircle2 size={16} aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
      </a>
      <div className="card-actions">
        <button type="button" onClick={() => setSelectedId(product.id)}>
          {isSelected ? 'Selected' : 'Preview'}
          <TicketCheck size={18} aria-hidden="true" />
        </button>
        <a href={`/checkout?id=${product.id}`}>
          Checkout
          <ShoppingBag size={18} aria-hidden="true" />
        </a>
      </div>
    </article>
  )
}
