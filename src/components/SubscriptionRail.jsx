import ProductLogo from './ProductLogo.jsx'

export default function SubscriptionRail({ products }) {
  const uniqueProducts = products.filter(
    (product, index, list) =>
      list.findIndex((item) => (item.logoKey ?? item.name) === (product.logoKey ?? product.name)) ===
      index,
  )
  const railProducts = [...uniqueProducts, ...uniqueProducts]

  return (
    <section className="subscription-rail" aria-label="Offered subscriptions">
      <div className="rail-heading">
        <span>Available on FlixBuzz</span>
        <p>Streaming, AI, VPN, creative tools, learning and more.</p>
      </div>
      <div className="rail-window">
        <div className="rail-track">
          {railProducts.map((product, index) => (
            <a className="rail-item" href={`/product?id=${product.id}`} key={`${product.id}-${index}`}>
              <ProductLogo product={product} />
              <span>{product.logoKey ?? product.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
