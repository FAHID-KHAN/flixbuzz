import { useEffect, useMemo, useState } from 'react'
import './App.css'
import AdminPage from './pages/Admin.jsx'
import CheckoutPage from './pages/Checkout.jsx'
import HomePage from './pages/Home.jsx'
import ProductDetailPage from './pages/ProductDetail.jsx'
import ReviewPage from './pages/ReviewPage.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'
import { durationLabels, initialProducts } from './data/products.js'

const catalogStorageKey = 'flixbuzz-products'

const loadSavedProducts = () => {
  try {
    const savedProducts = JSON.parse(
      window.localStorage.getItem(catalogStorageKey) || '[]',
    )

    if (!Array.isArray(savedProducts) || savedProducts.length === 0) {
      return initialProducts
    }

    const savedProductMap = new Map(
      savedProducts.map((product) => [product.id, product]),
    )
    const initialProductIds = new Set(initialProducts.map((product) => product.id))
    const mergedProducts = initialProducts.map((product) => ({
      ...product,
      ...savedProductMap.get(product.id),
    }))
    const customProducts = savedProducts.filter(
      (product) => !initialProductIds.has(product.id),
    )

    return [...mergedProducts, ...customProducts]
  } catch {
    return initialProducts
  }
}

function App() {
  const [products, setProducts] = useState(loadSavedProducts)
  const [selectedId, setSelectedId] = useState(initialProducts[0].id)
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured')
  const [searchTerm, setSearchTerm] = useState('')
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem('flixbuzz-theme')
    return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark'
  })
  const [isLoading, setIsLoading] = useState(() => {
    return !window.sessionStorage.getItem('flixbuzz-loaded')
  })
  const [verification, setVerification] = useState({
    customer: '',
    orderId: '',
    productId: initialProducts[0].id,
  })
  const [review, setReview] = useState({
    name: '',
    product: '',
    rating: 5,
    message: '',
  })
  const [orders, setOrders] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [adminPasscode, setAdminPasscode] = useState(() => {
    return window.localStorage.getItem('flixbuzz-admin-passcode') || ''
  })
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [hasCatalogChanges, setHasCatalogChanges] = useState(false)
  const [catalogSaveMessage, setCatalogSaveMessage] = useState(
    'Catalog is loaded from saved browser data.',
  )
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Streaming',
    duration: 1,
    price: '',
  })

  const route = window.location.pathname
  const routeId = Number(new URLSearchParams(window.location.search).get('id'))

  useEffect(() => {
    window.localStorage.setItem('flixbuzz-theme', theme)
  }, [theme])

  useEffect(() => {
    if (!isLoading) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      window.sessionStorage.setItem('flixbuzz-loaded', 'true')
      setIsLoading(false)
    }, 1700)

    return () => window.clearTimeout(timer)
  }, [isLoading])

  const selectedProduct = useMemo(
    () =>
      products.find((product) => product.id === (routeId || selectedId)) ??
      products[0],
    [routeId, products, selectedId],
  )

  const verifiedProduct = useMemo(
    () =>
      products.find((product) => product.id === Number(verification.productId)),
    [products, verification.productId],
  )

  const visibleProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()
    const categoryProducts =
      activeCategory === 'All'
        ? products
        : products.filter((product) => product.category === activeCategory)

    const searchedProducts = normalizedSearch
      ? categoryProducts.filter((product) =>
          [product.name, product.category, product.tag, product.description]
            .join(' ')
            .toLowerCase()
            .includes(normalizedSearch),
        )
      : categoryProducts

    return [...searchedProducts].sort((first, second) => {
      const firstPrice = first.price || Number.MAX_SAFE_INTEGER
      const secondPrice = second.price || Number.MAX_SAFE_INTEGER

      if (sortBy === 'price-low') {
        return firstPrice - secondPrice
      }
      if (sortBy === 'price-high') {
        return secondPrice - firstPrice
      }
      if (sortBy === 'duration') {
        return first.duration - second.duration
      }
      return first.id - second.id
    })
  }, [activeCategory, products, searchTerm, sortBy])

  const handlePriceChange = (id, price) => {
    setHasCatalogChanges(true)
    setCatalogSaveMessage('Unsaved catalog changes.')
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === id ? { ...product, price: Number(price) } : product,
      ),
    )
  }

  const handleAvailabilityChange = (id, availability) => {
    setHasCatalogChanges(true)
    setCatalogSaveMessage('Unsaved catalog changes.')
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === id ? { ...product, availability } : product,
      ),
    )
  }

  const handleCreateOrder = (order) => {
    const nextOrder = {
      ...order,
      id: `FBZ-${Date.now().toString().slice(-6)}`,
      status: 'Pending',
      createdAt: new Date().toLocaleString(),
    }

    setOrders((currentOrders) => [nextOrder, ...currentOrders])
    return nextOrder
  }

  const handleOrderStatusChange = (id, status) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === id ? { ...order, status } : order,
      ),
    )
  }

  const handleAddProduct = (event) => {
    event.preventDefault()

    if (!newProduct.name.trim() || !newProduct.price) {
      return
    }

    const nextProduct = {
      id: Date.now(),
      name: newProduct.name.trim(),
      category: newProduct.category,
      duration: Number(newProduct.duration),
      price: Number(newProduct.price),
      tag: durationLabels[newProduct.duration],
      tone: 'new',
      availability: 'Available',
      description: `${newProduct.name.trim()} with verified FlixBuzz setup and support.`,
      features: [
        `${durationLabels[newProduct.duration]} verified access`,
        'Manual order check',
        'Customer support included',
      ],
    }

    setProducts((currentProducts) => [...currentProducts, nextProduct])
    setHasCatalogChanges(true)
    setCatalogSaveMessage('Unsaved catalog changes.')
    setActiveCategory(newProduct.category)
    setSelectedId(nextProduct.id)
    setVerification((current) => ({ ...current, productId: nextProduct.id }))
    setNewProduct({ name: '', category: 'Streaming', duration: 1, price: '' })
  }

  const handleLogin = (event) => {
    event.preventDefault()
    const trimmedPassword = password.trim()

    if (!adminPasscode) {
      if (trimmedPassword.length < 8) {
        setLoginError('Use at least 8 characters to set the admin passcode.')
        return
      }

      window.localStorage.setItem('flixbuzz-admin-passcode', trimmedPassword)
      setAdminPasscode(trimmedPassword)
      setIsLoggedIn(true)
      setPassword('')
      setLoginError('')
      return
    }

    if (trimmedPassword === adminPasscode) {
      setIsLoggedIn(true)
      setPassword('')
      setLoginError('')
      return
    }

    setLoginError('Wrong admin passcode for this browser.')
  }

  const handleSaveCatalog = () => {
    window.localStorage.setItem(catalogStorageKey, JSON.stringify(products))
    setHasCatalogChanges(false)
    setCatalogSaveMessage('Catalog saved. Public website will use these prices.')
  }

  if (isLoading && route !== '/admin') {
    return <LoadingScreen theme={theme} />
  }

  if (route === '/admin') {
    return (
      <AdminPage
        catalogSaveMessage={catalogSaveMessage}
        handleAvailabilityChange={handleAvailabilityChange}
        handleAddProduct={handleAddProduct}
        handleLogin={handleLogin}
        handlePriceChange={handlePriceChange}
        handleSaveCatalog={handleSaveCatalog}
        hasCatalogChanges={hasCatalogChanges}
        isLoggedIn={isLoggedIn}
        loginError={loginError}
        newProduct={newProduct}
        orders={orders}
        passcodeIsSet={Boolean(adminPasscode)}
        password={password}
        products={products}
        setNewProduct={setNewProduct}
        setPassword={setPassword}
        setShowPassword={setShowPassword}
        showPassword={showPassword}
        handleOrderStatusChange={handleOrderStatusChange}
      />
    )
  }

  if (route === '/checkout') {
    return (
      <CheckoutPage
        handleCreateOrder={handleCreateOrder}
        product={selectedProduct}
        products={products}
        setTheme={setTheme}
        theme={theme}
      />
    )
  }

  if (route === '/product') {
    return (
      <ProductDetailPage
        product={selectedProduct}
        products={products}
        setTheme={setTheme}
        theme={theme}
      />
    )
  }

  if (route === '/review') {
    return (
      <ReviewPage
        products={products}
        review={review}
        setReview={setReview}
        setTheme={setTheme}
        theme={theme}
      />
    )
  }

  return (
    <HomePage
      activeCategory={activeCategory}
      allProducts={products}
      products={visibleProducts}
      searchTerm={searchTerm}
      selectedProduct={selectedProduct}
      selectedId={selectedId}
      setTheme={setTheme}
      setActiveCategory={setActiveCategory}
      setSearchTerm={setSearchTerm}
      setSelectedId={setSelectedId}
      setSortBy={setSortBy}
      setVerification={setVerification}
      sortBy={sortBy}
      theme={theme}
      verification={verification}
      verifiedProduct={verifiedProduct}
    />
  )
}

export default App
