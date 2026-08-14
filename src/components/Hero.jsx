import { Clapperboard, Sparkles, Star, Zap } from 'lucide-react'

export default function Hero({ selectedProduct }) {
  return (
    <section className="hero-section" id="home">
      <div className="hero-copy">
        <span className="eyebrow">
          <Sparkles size={16} aria-hidden="true" />
          Premium pass bazaar, but make it cinema
        </span>
        <h1>Subscriptions with main-character energy.</h1>
        <p>
          Streaming, AI, VPN, creative tools, learning apps, and software
          subscriptions with quick setup, order verification, and actual human
          support when the login screen starts acting dramatic.
        </p>
        <div className="headline-strip" aria-label="Quick selling points">
          <span>No boring checkout tunnel</span>
          <span>Pick. Ping. Play.</span>
          <span>Verify kore chill</span>
        </div>
        <div className="hero-actions">
          <a className="primary-link" href="#plans">
            Pick your buzz
          </a>
          <a className="secondary-link" href="#verify">
            Verify order
          </a>
        </div>
      </div>

      <div className="showcase" aria-label="FlixBuzz subscription preview">
        <div className="orbit-ring"></div>
        <div className="mascot-bubble" aria-hidden="true">
          <div className="mascot-face">
            <span className="mascot-eye"></span>
            <span className="mascot-eye"></span>
            <span className="mascot-smile"></span>
          </div>
          <span className="mascot-tag">Buzz!</span>
        </div>
        <div className="sticker sticker-one" aria-hidden="true">
          POPCORN
        </div>
        <div className="sticker sticker-two" aria-hidden="true">
          AI MODE
        </div>
        <div className="sticker sticker-three" aria-hidden="true">
          VPN ON
        </div>
        <div className="poster-stack">
          <div className="poster poster-one">
            <Clapperboard size={28} aria-hidden="true" />
            <span>flix</span>
          </div>
          <div className="poster poster-two">
            <Zap size={28} aria-hidden="true" />
            <span>buzz</span>
          </div>
          <div className="poster poster-three">
            <Star size={28} aria-hidden="true" />
            <span>GO</span>
          </div>
        </div>
        <div className="live-card">
          <span>{selectedProduct.category} selected</span>
          <strong>{selectedProduct.name}</strong>
          <p>BDT {selectedProduct.price.toLocaleString()}</p>
        </div>
      </div>
    </section>
  )
}
