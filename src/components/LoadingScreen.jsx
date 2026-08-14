import { Clapperboard, Sparkles, Zap } from 'lucide-react'

function LoadingScreen({ theme }) {
  return (
    <main className={`loading-screen theme-${theme}`} aria-label="Loading FlixBuzz">
      <section className="loading-card">
        <div className="loading-mascot" aria-hidden="true">
          <span className="loading-antenna"></span>
          <span className="loading-eye"></span>
          <span className="loading-eye"></span>
          <span className="loading-mouth"></span>
        </div>
        <p className="loading-brand">FlixBuzz</p>
        <h1>Warming up the binge machine...</h1>
        <p>
          Counting passwords, polishing subscriptions, and asking buffering to
          behave nicely.
        </p>
        <div className="loading-chips" aria-hidden="true">
          <span>
            <Clapperboard size={16} />
            Streaming
          </span>
          <span>
            <Zap size={16} />
            AI tools
          </span>
          <span>
            <Sparkles size={16} />
            VPN magic
          </span>
        </div>
        <div className="loading-bar" aria-hidden="true">
          <span></span>
        </div>
      </section>
    </main>
  )
}

export default LoadingScreen
