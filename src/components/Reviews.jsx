import { Star } from 'lucide-react'

const reviews = [
  {
    name: 'তাসনিম আরা',
    plan: 'Netflix',
    text: 'Payment er por setup ta onek fast chilo. Support reply-o bhalo.',
  },
  {
    name: 'মাহিন ইসলাম',
    plan: 'ChatGPT Plus',
    text: 'Verified delivery, no confusion. Amar study workflow e huge help.',
  },
  {
    name: 'শারমিন সুলতানা',
    plan: 'Canva Pro',
    text: 'Design kajer jonno perfect. Renewal reminder ta useful.',
  },
]

export default function Reviews() {
  return (
    <section className="reviews-section">
      <div className="section-heading">
        <span>Reviews</span>
        <h2>Real support, real relief.</h2>
        <a className="review-link" href="/review">
          Leave a review
        </a>
      </div>
      <div className="reviews-grid">
        {reviews.map((review) => (
          <article className="review-card" key={review.name}>
            <div className="stars" aria-label="5 star review">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star fill="currentColor" key={index} size={16} />
              ))}
            </div>
            <p>{review.text}</p>
            <strong>{review.name}</strong>
            <span>{review.plan}</span>
          </article>
        ))}
      </div>
    </section>
  )
}
