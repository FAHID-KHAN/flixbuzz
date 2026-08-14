import { useState } from 'react'
import { brandLogos } from '../data/brandLogos.js'

export default function ProductLogo({ product }) {
  const [logoFailed, setLogoFailed] = useState(false)
  const logo = brandLogos[product.logoKey ?? product.name]
  const initials = product.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 3)
    .toUpperCase()

  return (
    <div className="brand-logo-frame">
      <span className="logo-fallback">{initials}</span>
      {logo && !logoFailed ? (
        <img
          src={logo}
          alt={`${product.name} logo`}
          width="144"
          height="96"
          loading="lazy"
          decoding="async"
          onError={() => setLogoFailed(true)}
        />
      ) : null}
    </div>
  )
}
