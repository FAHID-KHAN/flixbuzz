import { Check, ReceiptText, ShieldCheck } from 'lucide-react'
import { durationLabels } from '../data/products.js'

export default function Contact({
  products,
  setVerification,
  verification,
  verifiedProduct,
}) {
  return (
    <section className="verify-section" id="verify">
      <div>
        <span className="section-label">
          <ShieldCheck size={16} aria-hidden="true" />
          Verify
        </span>
        <h2>Order check, then chill mode on.</h2>
        <p>
          Choose the customer product and see the matching category, duration,
          and price instantly. Later this can connect to real order records.
        </p>
      </div>

      <form className="verify-form">
        <label>
          Customer name
          <input
            type="text"
            placeholder="Example: Fahid Khan"
            value={verification.customer}
            onChange={(event) =>
              setVerification((current) => ({
                ...current,
                customer: event.target.value,
              }))
            }
          />
        </label>
        <label>
          Order ID
          <input
            type="text"
            placeholder="FBZ-1001"
            value={verification.orderId}
            onChange={(event) =>
              setVerification((current) => ({
                ...current,
                orderId: event.target.value,
              }))
            }
          />
        </label>
        <label>
          Subscription type
          <select
            value={verification.productId}
            onChange={(event) =>
              setVerification((current) => ({
                ...current,
                productId: event.target.value,
              }))
            }
          >
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - {product.category}
              </option>
            ))}
          </select>
        </label>
        <div className="verification-result">
          <ReceiptText size={20} aria-hidden="true" />
          <div>
            <span>Verified package</span>
            <strong>{verifiedProduct?.name}</strong>
            <p>
              {durationLabels[verifiedProduct?.duration]} at BDT{' '}
              {verifiedProduct?.price.toLocaleString()}
            </p>
          </div>
          <Check size={20} aria-hidden="true" />
        </div>
      </form>
    </section>
  )
}
