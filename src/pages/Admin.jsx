import { Eye, EyeOff, LockKeyhole, Plus } from 'lucide-react'
import { categories, durationLabels } from '../data/products.js'

export default function AdminPage({
  handleAvailabilityChange,
  handleAddProduct,
  handleLogin,
  handleOrderStatusChange,
  handlePriceChange,
  isLoggedIn,
  loginError,
  newProduct,
  orders,
  passcodeIsSet,
  password,
  products,
  setNewProduct,
  setPassword,
  setShowPassword,
  showPassword,
}) {
  if (!isLoggedIn) {
    return (
      <main className="admin-login-page">
        <form className="login-card" onSubmit={handleLogin}>
          <span className="brand-mark">FB</span>
          <h1>Admin login</h1>
          <p>Edit prices, add new products, and keep the catalog ready for customers.</p>
          <label>
            {passcodeIsSet ? 'Admin passcode' : 'Create admin passcode'}
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={passcodeIsSet ? 'Enter admin passcode' : 'Minimum 8 characters'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                type="button"
                onClick={() => setShowPassword((current) => !current)}
              >
                {showPassword ? (
                  <EyeOff size={18} aria-hidden="true" />
                ) : (
                  <Eye size={18} aria-hidden="true" />
                )}
              </button>
            </div>
          </label>
          {loginError && <span className="login-error">{loginError}</span>}
          <button type="submit">
            <LockKeyhole size={18} aria-hidden="true" />
            {passcodeIsSet ? 'Login' : 'Set passcode'}
          </button>
          <small>
            {passcodeIsSet
              ? 'This passcode is saved locally in this browser.'
              : 'First login sets the admin passcode for this browser.'}
          </small>
        </form>
      </main>
    )
  }

  return (
    <main className="admin-page">
      <nav className="admin-topbar">
        <div>
          <span>FlixBuzz Admin</span>
          <h1>Price lab and product vault</h1>
        </div>
        <a href="/">View website</a>
      </nav>

      <section className="admin-grid">
        <div className="admin-panel">
          <h2>Editable pricing</h2>
          {products.map((product) => (
            <div className="admin-product-row" key={product.id}>
              <label className="price-row">
                <span>
                  {product.name}
                  <small>
                    {product.category} - {durationLabels[product.duration]}
                  </small>
                </span>
                <input
                  type="number"
                  min="0"
                  value={product.price}
                  onChange={(event) =>
                    handlePriceChange(product.id, event.target.value)
                  }
                />
              </label>
              <label>
                Availability
                <select
                  value={product.availability}
                  onChange={(event) =>
                    handleAvailabilityChange(product.id, event.target.value)
                  }
                >
                  <option value="Available">Available</option>
                  <option value="Limited">Limited</option>
                  <option value="Out of stock">Out of stock</option>
                </select>
              </label>
            </div>
          ))}
        </div>

        <form className="admin-panel" onSubmit={handleAddProduct}>
          <h2>Add product</h2>
          <label>
            Product name
            <input
              type="text"
              placeholder="Buzz Family"
              value={newProduct.name}
              onChange={(event) =>
                setNewProduct((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
            />
          </label>
          <label>
            Category
            <select
              value={newProduct.category}
              onChange={(event) =>
                setNewProduct((current) => ({
                  ...current,
                  category: event.target.value,
                }))
              }
            >
              {categories
                .filter((category) => category !== 'All')
                .map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>
          </label>
          <label>
            Duration
            <select
              value={newProduct.duration}
              onChange={(event) =>
                setNewProduct((current) => ({
                  ...current,
                  duration: Number(event.target.value),
                }))
              }
            >
              <option value="1">1 month</option>
              <option value="3">3 months</option>
              <option value="6">6 months</option>
              <option value="12">12 months</option>
            </select>
          </label>
          <label>
            Price
            <input
              type="number"
              min="0"
              placeholder="1999"
              value={newProduct.price}
              onChange={(event) =>
                setNewProduct((current) => ({
                  ...current,
                  price: event.target.value,
                }))
              }
            />
          </label>
          <button type="submit">
            <Plus size={18} aria-hidden="true" />
            Add product
          </button>
        </form>
      </section>

      <section className="admin-orders">
        <div className="section-heading">
          <span>Orders</span>
          <h2>Request tracking</h2>
        </div>
        {orders.length === 0 ? (
          <div className="empty-state">
            <strong>No pending requests yet</strong>
            <p>Checkout requests will appear here after customers submit them.</p>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map((order) => (
              <article className="order-card" key={order.id}>
                <div>
                  <span>{order.id}</span>
                  <strong>{order.productName}</strong>
                  <p>{order.customer} - {order.phone || 'No phone'}</p>
                </div>
                <dl>
                  <div>
                    <dt>Plan</dt>
                    <dd>{order.plan}</dd>
                  </div>
                  <div>
                    <dt>Price</dt>
                    <dd>{order.price}</dd>
                  </div>
                  <div>
                    <dt>Payment</dt>
                    <dd>{order.paymentMethod}</dd>
                  </div>
                  <div>
                    <dt>Created</dt>
                    <dd>{order.createdAt}</dd>
                  </div>
                </dl>
                <label>
                  Status
                  <select
                    value={order.status}
                    onChange={(event) =>
                      handleOrderStatusChange(order.id, event.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Verified">Verified</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </label>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
