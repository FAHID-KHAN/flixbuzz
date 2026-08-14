import { useState } from 'react'
import { ArrowLeft, CheckCircle2, MessageCircle, ShieldCheck } from 'lucide-react'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import { durationLabels } from '../data/products.js'

const faviconUrl = (domain) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=128`

const bankTransferLogo = `data:image/svg+xml,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
    <rect width="128" height="128" rx="28" fill="#111111"/>
    <path d="M24 55h80L64 30 24 55Z" fill="#ff313c"/>
    <path d="M34 61h12v31H34V61Zm24 0h12v31H58V61Zm24 0h12v31H82V61Z" fill="#ffffff"/>
    <path d="M28 98h72" stroke="#ffffff" stroke-width="8" stroke-linecap="round"/>
  </svg>
`)}`;

const paymentMethods = [
  {
    id: 'bkash',
    name: 'bKash',
    detail: 'Pay after admin confirms availability',
    logo: faviconUrl('bkash.com'),
  },
  {
    id: 'nagad',
    name: 'Nagad',
    detail: 'Fast mobile payment confirmation',
    logo: faviconUrl('nagad.com.bd'),
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    detail: 'Manual bank deposit or transfer',
    logo: bankTransferLogo,
  },
  {
    id: 'manual',
    name: 'Discuss on WhatsApp',
    detail: 'Confirm payment method with admin',
    logo: faviconUrl('whatsapp.com'),
  },
]

export default function CheckoutPage({
  handleCreateOrder,
  product,
  products,
  setTheme,
  theme,
}) {
  const [customer, setCustomer] = useState('')
  const [phone, setPhone] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('base')
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].id)
  const [notes, setNotes] = useState('')
  const [savedOrder, setSavedOrder] = useState(null)

  const planOptions = [
    {
      id: 'base',
      label: `${durationLabels[product.duration]} - ${product.tag}`,
      price: product.price,
    },
    product.globalPrice
      ? { id: 'global', label: 'Global Plan', price: product.globalPrice }
      : null,
    product.threeMonthPrice
      ? { id: 'three-month', label: '3 Months', price: product.threeMonthPrice }
      : null,
  ].filter(Boolean)

  const activePlan =
    planOptions.find((option) => option.id === selectedPlan) ?? planOptions[0]

  const priceLabel =
    activePlan.price > 0
      ? `BDT ${activePlan.price.toLocaleString()}`
      : 'Price on request'
  const activePayment =
    paymentMethods.find((method) => method.id === paymentMethod) ??
    paymentMethods[0]

  const handleSubmit = (event) => {
    event.preventDefault()

    const order = handleCreateOrder({
      customer: customer.trim() || 'Customer',
      phone: phone.trim(),
      productName: product.name,
      productId: product.id,
      category: product.category,
      plan: activePlan.label,
      price: priceLabel,
      paymentMethod: activePayment.name,
      notes: notes.trim(),
    })
    setSavedOrder(order)

    const whatsappMessage = encodeURIComponent(
      `Hi FlixBuzz, I want to order ${product.name} (${product.category}). Plan: ${activePlan.label}. Price: ${priceLabel}. Payment method: ${order.paymentMethod}. Name: ${order.customer}. Phone: ${order.phone || 'Not provided'}. Order ref: ${order.id}. Notes: ${order.notes || 'None'}. Please confirm availability and payment details.`,
    )

    window.open(`https://wa.me/8801580744443?text=${whatsappMessage}`, '_self')
  }

  return (
    <main className={`site-shell checkout-shell theme-${theme}`}>
      <Navbar setTheme={setTheme} theme={theme} />
      <section className="checkout-page">
        <a className="back-link" href="/#plans">
          <ArrowLeft size={18} aria-hidden="true" />
          Back to catalog
        </a>

        <div className="checkout-grid">
          <div className="checkout-stage">
            <span className={`plan-badge ${product.tone}`}>{product.category}</span>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <div className="checkout-price">
              <span>Selected package</span>
              <strong>{priceLabel}</strong>
              <small>{activePlan.label} verified access</small>
            </div>
            <div className="checkout-steps">
              <span>
                <ShieldCheck size={18} aria-hidden="true" />
                Select plan
              </span>
              <span>
                <MessageCircle size={18} aria-hidden="true" />
                Message on WhatsApp
              </span>
              <span>
                <CheckCircle2 size={18} aria-hidden="true" />
                Admin verifies
              </span>
            </div>
          </div>

          <aside className="checkout-card">
            <h2>Order summary</h2>
            <dl>
              <div>
                <dt>Product</dt>
                <dd>{product.name}</dd>
              </div>
              <div>
                <dt>Category</dt>
                <dd>{product.category}</dd>
              </div>
              <div>
                <dt>Duration</dt>
                <dd>{activePlan.label}</dd>
              </div>
              <div>
                <dt>Price</dt>
                <dd>{priceLabel}</dd>
              </div>
              <div>
                <dt>Payment</dt>
                <dd>{activePayment.name}</dd>
              </div>
            </dl>
            <ul>
              {product.features.map((feature) => (
                <li key={feature}>
                  <CheckCircle2 size={16} aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
            <form className="checkout-form" onSubmit={handleSubmit}>
              <label>
                Name
                <input
                  type="text"
                  placeholder="Your name"
                  value={customer}
                  onChange={(event) => setCustomer(event.target.value)}
                />
              </label>
              <label>
                Phone
                <input
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </label>
              <label>
                Plan option
                <select
                  value={selectedPlan}
                  onChange={(event) => setSelectedPlan(event.target.value)}
                >
                  {planOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label} -{' '}
                      {option.price > 0
                        ? `BDT ${option.price.toLocaleString()}`
                        : 'Ask for price'}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Notes
                <input
                  type="text"
                  placeholder="Any account or timing note"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
              </label>
              <fieldset className="payment-methods">
                <legend>Payment after confirmation</legend>
                {paymentMethods.map((method) => (
                  <label
                    className={`payment-option ${
                      paymentMethod === method.id ? 'active' : ''
                    }`}
                    key={method.id}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(event) => setPaymentMethod(event.target.value)}
                    />
                    <img
                      src={method.logo}
                      alt={`${method.name} logo`}
                      width="34"
                      height="34"
                      loading="lazy"
                      decoding="async"
                    />
                    <span>{method.name}</span>
                    <small>{method.detail}</small>
                  </label>
                ))}
              </fieldset>
              {savedOrder && (
                <span className="saved-order">Saved request: {savedOrder.id}</span>
              )}
              <button className="whatsapp-checkout" type="submit">
                <MessageCircle size={20} aria-hidden="true" />
                Save request and WhatsApp
              </button>
            </form>
          </aside>
        </div>

        <section className="related-strip" aria-label="More subscriptions">
          {products
            .filter(
              (item) => item.category === product.category && item.id !== product.id,
            )
            .slice(0, 4)
            .map((item) => (
              <a href={`/checkout?id=${item.id}`} key={item.id}>
                <span>{item.name}</span>
                <strong>
                  {item.price > 0
                    ? `BDT ${item.price.toLocaleString()}`
                    : 'Ask for price'}
                </strong>
              </a>
            ))}
        </section>
      </section>
      <Footer />
    </main>
  )
}
