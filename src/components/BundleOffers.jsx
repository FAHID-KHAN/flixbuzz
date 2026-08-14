import { MessageCircle, PackageCheck } from 'lucide-react'
import { bundleOffers } from '../data/products.js'
import ProductLogo from './ProductLogo.jsx'

export default function BundleOffers({ products }) {
  const bundles = bundleOffers.map((bundle) => {
    const bundleProducts = bundle.productNames
      .map((name) => products.find((product) => product.name === name))
      .filter(Boolean)

    const total = bundleProducts.reduce(
      (sum, product) => sum + (product.price || 0),
      0,
    )

    return { ...bundle, products: bundleProducts, total }
  })

  const createBundleLink = (bundle) => {
    const services = bundle.products.map((product) => product.name).join(', ')
    const message = encodeURIComponent(
      `Hi FlixBuzz, I want the ${bundle.name}. Services: ${services}. Estimated total: BDT ${bundle.total.toLocaleString()}. Please confirm availability and best bundle price.`,
    )

    return `https://wa.me/8801580744443?text=${message}`
  }

  return (
    <section className="bundle-section" id="bundles">
      <div className="section-heading">
        <span>Bundles</span>
        <h2>Packs for people who already know the vibe.</h2>
      </div>

      <div className="bundle-grid">
        {bundles.map((bundle) => (
          <article className="bundle-card" key={bundle.id}>
            <span className="bundle-tag">
              <PackageCheck size={17} aria-hidden="true" />
              {bundle.category}
            </span>
            <h3>{bundle.name}</h3>
            <p>{bundle.description}</p>
            <div className="bundle-logos" aria-label={`${bundle.name} services`}>
              {bundle.products.map((product) => (
                <ProductLogo key={product.id} product={product} />
              ))}
            </div>
            <div className="bundle-meta">
              <span>{bundle.tone}</span>
              <strong>From BDT {bundle.total.toLocaleString()}</strong>
            </div>
            <a href={createBundleLink(bundle)}>
              <MessageCircle size={17} aria-hidden="true" />
              Ask bundle price
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}
