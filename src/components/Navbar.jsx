import { BadgeCheck, MessageCircle, Moon, Sun } from 'lucide-react'

export default function Navbar({ setTheme, theme }) {
  return (
    <nav className="topbar" aria-label="Primary navigation">
      <a className="brand" href="/">
        <span className="brand-mark">FB</span>
        <span>FlixBuzz</span>
        <BadgeCheck size={18} aria-label="Verified" />
      </a>
      <div className="nav-actions">
        <a href="/#plans">Plans</a>
        <a href="/#verify">Verify</a>
        <a href="/review">Review</a>
        <a className="whatsapp-link" href="https://wa.me/8801580744443">
          <MessageCircle size={18} aria-hidden="true" />
          WhatsApp
        </a>
        <button
          className="theme-toggle"
          type="button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <Sun size={18} aria-hidden="true" />
          ) : (
            <Moon size={18} aria-hidden="true" />
          )}
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </div>
    </nav>
  )
}
