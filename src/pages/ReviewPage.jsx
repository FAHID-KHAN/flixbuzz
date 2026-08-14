import { MessageCircle, ShieldCheck, Star } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

function ReviewPage({
  products,
  review,
  setReview,
  setTheme,
  theme,
}) {
  const ratingOptions = [5, 4, 3, 2, 1]

  const handleSubmit = (event) => {
    event.preventDefault()

    const message = encodeURIComponent(
      `Hi FlixBuzz, I want to leave a review.\n\nName: ${review.name || 'Anonymous'}\nRating: ${review.rating}/5\nService: ${review.product || 'Not selected'}\nReview: ${review.message || 'No written review'}\nCan you add this to the website after checking?`,
    )

    window.open(`https://wa.me/8801580744443?text=${message}`, '_self')
  }

  return (
    <main className={`site-shell review-shell theme-${theme}`}>
      <Navbar setTheme={setTheme} theme={theme} />
      <section className="review-page">
        <div className="review-hero">
          <span className="eyebrow">
            <ShieldCheck size={16} aria-hidden="true" />
            Customer voice
          </span>
          <h1>Leave a review that helps the next binge decision.</h1>
          <p>
            Share how your order went, which subscription you picked, and how
            fast the setup felt. The review goes to FlixBuzz on WhatsApp for a
            quick manual check before it appears publicly.
          </p>
        </div>

        <form className="review-form" onSubmit={handleSubmit}>
          <label>
            Your name
            <input
              type="text"
              placeholder="Nurul Islam"
              value={review.name}
              onChange={(event) =>
                setReview((current) => ({ ...current, name: event.target.value }))
              }
            />
          </label>

          <label>
            Subscription
            <select
              value={review.product}
              onChange={(event) =>
                setReview((current) => ({
                  ...current,
                  product: event.target.value,
                }))
              }
            >
              <option value="">Choose the service</option>
              {products.map((product) => (
                <option key={product.id} value={product.name}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>

          <fieldset className="rating-picker">
            <legend>Rating</legend>
            <div>
              {ratingOptions.map((rating) => (
                <button
                  className={Number(review.rating) >= rating ? 'active' : ''}
                  key={rating}
                  type="button"
                  onClick={() =>
                    setReview((current) => ({ ...current, rating }))
                  }
                  aria-label={`${rating} star review`}
                >
                  <Star fill="currentColor" size={22} />
                </button>
              ))}
            </div>
          </fieldset>

          <label>
            Your review
            <textarea
              placeholder="Setup fast chilo, support helpful chilo..."
              value={review.message}
              onChange={(event) =>
                setReview((current) => ({
                  ...current,
                  message: event.target.value,
                }))
              }
              rows="5"
            />
          </label>

          <button className="whatsapp-checkout" type="submit">
            <MessageCircle size={18} aria-hidden="true" />
            Send review on WhatsApp
          </button>
        </form>
      </section>
      <Footer />
    </main>
  )
}

export default ReviewPage
