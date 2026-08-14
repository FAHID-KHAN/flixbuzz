const faqs = [
  {
    question: 'Delivery kotokkhon lage?',
    answer: 'Most subscriptions are processed manually after confirmation on WhatsApp.',
  },
  {
    question: 'Bangladesh and Global plan difference ki?',
    answer: 'Some services have region-based pricing. Select the plan shown on the product card or ask on WhatsApp before confirming.',
  },
  {
    question: 'Payment gateway kothay?',
    answer: 'No online payment gateway yet. Checkout sends your selected package to WhatsApp for manual confirmation.',
  },
  {
    question: 'Login issue hole ki hobe?',
    answer: 'Message FlixBuzz with your order ID and product name so the admin can verify and support the order.',
  },
]

export default function FAQ() {
  return (
    <section className="faq-section">
      <div className="section-heading">
        <span>FAQ</span>
        <h2>Questions before the binge begins.</h2>
      </div>
      <div className="faq-list">
        {faqs.map((faq) => (
          <details key={faq.question}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
