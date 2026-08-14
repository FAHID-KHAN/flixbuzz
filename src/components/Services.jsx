import {
  ArrowUpDown,
  Clock3,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { categories, durationLabels } from '../data/products.js'
import ProductCard from './ProductCard.jsx'

export default function Services({
  activeCategory,
  allProducts,
  products,
  searchTerm,
  selectedId,
  setActiveCategory,
  setSearchTerm,
  setSelectedId,
  setSortBy,
  sortBy,
}) {
  const suggestionGroups = [
    { label: 'movie', terms: ['Netflix', 'Prime Video Lite', 'HBO Max', 'Disney Plus', 'YouTube Premium'] },
    { label: 'AI', terms: ['ChatGPT Plus', 'Gemini Pro', 'Claude AI', 'Grok AI'] },
    { label: 'design', terms: ['Canva Pro', 'CapCut Pro Shared', 'Adobe Creative Cloud'] },
    { label: 'VPN', terms: ['NordVPN', 'HMA VPN', 'Surfshark VPN'] },
    { label: 'study', terms: ['Coursera Plus 6 Months', 'Coursera Plus 1 Year', 'Grammarly', 'Duolingo'] },
  ]

  const normalizedSearch = searchTerm.trim().toLowerCase()
  const directSuggestions = allProducts
    .filter((product) =>
      normalizedSearch
        ? [product.name, product.category, product.tag, product.description]
            .join(' ')
            .toLowerCase()
            .includes(normalizedSearch)
        : false,
    )
    .slice(0, 5)

  const keywordSuggestions = suggestionGroups
    .filter((group) => normalizedSearch && group.label.includes(normalizedSearch))
    .flatMap((group) =>
      group.terms
        .map((name) => allProducts.find((product) => product.name === name))
        .filter(Boolean),
    )

  const suggestions = [...directSuggestions, ...keywordSuggestions]
    .filter(
      (product, index, list) =>
        list.findIndex((item) => item.id === product.id) === index,
    )
    .slice(0, 5)

  return (
    <section className="plans-section" id="plans">
      <div className="catalog-heading">
        <div className="section-heading">
          <span>Catalog</span>
          <h2>Pick your premium pass.</h2>
        </div>
        <div className="catalog-count">
          <Sparkles size={17} aria-hidden="true" />
          <strong>{products.length}</strong>
          <span>{products.length === 1 ? 'match' : 'matches'} ready</span>
        </div>
      </div>

      <div className="catalog-console">
        <div className="catalog-toolbar">
          <label className="search-field">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              placeholder="Search Netflix, VPN, AI, Canva..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            {suggestions.length > 0 && (
              <div className="search-suggestions">
                {suggestions.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => {
                      setSearchTerm(product.name)
                      setActiveCategory('All')
                      setSelectedId(product.id)
                    }}
                  >
                    <span>{product.name}</span>
                    <small>{product.category}</small>
                  </button>
                ))}
              </div>
            )}
          </label>
          <label className="sort-field">
            <ArrowUpDown size={18} aria-hidden="true" />
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price low to high</option>
              <option value="price-high">Price high to low</option>
              <option value="duration">Duration</option>
            </select>
          </label>
        </div>

        <div className="trust-strip" aria-label="Trust and order highlights">
          <span>
            <ShieldCheck size={17} aria-hidden="true" />
            Manually verified access
          </span>
          <span>
            <MessageCircle size={17} aria-hidden="true" />
            WhatsApp order support
          </span>
          <span>
            <Clock3 size={17} aria-hidden="true" />
            Renewal reminders
          </span>
        </div>
      </div>

      <div className="category-filter" aria-label="Filter products">
        {categories.map((category) => (
          <button
            className={activeCategory === category ? 'active' : ''}
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="plan-grid">
        {products.map((product) => (
          <ProductCard
            durationLabel={durationLabels[product.duration]}
            isSelected={selectedId === product.id}
            key={product.id}
            product={product}
            setSelectedId={setSelectedId}
          />
        ))}
      </div>

      {products.length === 0 && (
        <div className="empty-state">
          <strong>No subscriptions found</strong>
          <p>Try another category or search term.</p>
        </div>
      )}
    </section>
  )
}
