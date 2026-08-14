import {
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Star,
} from 'lucide-react'

export default function Footer() {
  return (
    <footer>
      <div className="footer-brand">
        <span className="brand-mark">FB</span>
        <div>
          <strong>FlixBuzz</strong>
          <p>Authentic and secure access to premium online subscriptions.</p>
        </div>
      </div>

      <div className="footer-details" aria-label="FlixBuzz contact details">
        <span>
          <MapPin size={18} aria-hidden="true" />
          Dhaka, Bangladesh, 1216
        </span>
        <span>
          <Star size={18} aria-hidden="true" />
          100% recommend (72 Reviews)
        </span>
        <span>
          <Clock size={18} aria-hidden="true" />
          Always open
        </span>
        <a href="tel:01580744443">
          <Phone size={18} aria-hidden="true" />
          01580-744443
        </a>
        <a href="mailto:flixbuzz5@gmail.com">
          <Mail size={18} aria-hidden="true" />
          flixbuzz5@gmail.com
        </a>
        <a href="https://wa.me/8801580744443">
          <MessageCircle size={18} aria-hidden="true" />
          +880 1580-744443
        </a>
        <a href="https://flixbuzz.carrd.co">
          <ExternalLink size={18} aria-hidden="true" />
          flixbuzz.carrd.co
        </a>
      </div>
    </footer>
  )
}
