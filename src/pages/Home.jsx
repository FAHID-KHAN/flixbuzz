import Contact from '../components/Contact.jsx'
import BundleOffers from '../components/BundleOffers.jsx'
import ClientBanner from '../components/ClientBanner.jsx'
import FAQ from '../components/FAQ.jsx'
import FeaturedProducts from '../components/FeaturedProducts.jsx'
import Footer from '../components/Footer.jsx'
import Hero from '../components/Hero.jsx'
import Navbar from '../components/Navbar.jsx'
import Reviews from '../components/Reviews.jsx'
import Services from '../components/Services.jsx'
import SubscriptionRail from '../components/SubscriptionRail.jsx'

export default function HomePage({
  activeCategory,
  allProducts,
  products,
  searchTerm,
  selectedProduct,
  selectedId,
  setActiveCategory,
  setSearchTerm,
  setSelectedId,
  setSortBy,
  setTheme,
  setVerification,
  sortBy,
  theme,
  verification,
  verifiedProduct,
}) {
  return (
    <main className={`site-shell theme-${theme}`}>
      <Navbar setTheme={setTheme} theme={theme} />
      <Hero selectedProduct={selectedProduct} />
      <SubscriptionRail products={allProducts} />
      <FeaturedProducts products={allProducts} />
      <BundleOffers products={allProducts} />
      <Services
        activeCategory={activeCategory}
        allProducts={allProducts}
        products={products}
        searchTerm={searchTerm}
        selectedId={selectedId}
        setActiveCategory={setActiveCategory}
        setSearchTerm={setSearchTerm}
        setSelectedId={setSelectedId}
        setSortBy={setSortBy}
        sortBy={sortBy}
      />
      <Contact
        products={allProducts}
        setVerification={setVerification}
        verification={verification}
        verifiedProduct={verifiedProduct}
      />
      <Reviews />
      <FAQ />
      <ClientBanner />
      <Footer />
    </main>
  )
}
