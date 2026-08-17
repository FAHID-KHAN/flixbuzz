import { useEffect, useMemo, useState } from 'react'
import './App.css'
import AdminPage from './pages/Admin.jsx'
import CheckoutPage from './pages/Checkout.jsx'
import HomePage from './pages/Home.jsx'
import ProductDetailPage from './pages/ProductDetail.jsx'
import ReviewPage from './pages/ReviewPage.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'
import { durationLabels, initialProducts } from './data/products.js'

const adminTokenStorageKey = 'flixbuzz-admin-token'

const loadAdminToken = () =>
  window.sessionStorage.getItem(adminTokenStorageKey) || ''

function App() {
  const [products, setProducts] = useState(initialProducts)
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
  const [adminToken, setAdminToken] = useState(loadAdminToken)
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(loadAdminToken()))
  const [adminConfigured, setAdminConfigured] = useState(true)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [hasCatalogChanges, setHasCatalogChanges] = useState(false)
  const [catalogSaveMessage, setCatalogSaveMessage] = useState(
    'Catalog is loaded from the SQLite database.',
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
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/products')

        if (!response.ok) {
          throw new Error('Could not load products')
        }

        const data = await response.json()
        setProducts(data.products)
        setCatalogSaveMessage('Catalog is loaded from the SQLite database.')
      } catch {
        setCatalogSaveMessage('API unavailable. Showing bundled fallback catalog.')
      }
    }

    const loadAdminStatus = async () => {
      try {
        const response = await fetch('/api/admin/status')

        if (!response.ok) {
          return
        }

        const data = await response.json()
        setAdminConfigured(Boolean(data.configured))
      } catch {
        setAdminConfigured(true)
      }
    }

    loadProducts()
    loadAdminStatus()
  }, [])

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

  const handleLogin = async (event) => {
    event.preventDefault()
    const trimmedPassword = password.trim()

    if (trimmedPassword.length < 8) {
      setLoginError('Use at least 8 characters.')
      return
    }

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: trimmedPassword }),
      })
      const data = await response.json()

      if (!response.ok) {
        setLoginError(data.message || 'Admin login failed.')
        return
      }

      window.sessionStorage.setItem(adminTokenStorageKey, data.token)
      setAdminToken(data.token)
      setAdminConfigured(true)
      setIsLoggedIn(true)
      setPassword('')
      setLoginError('')
      return
    } catch {
      setLoginError('API unavailable. Start the backend server and try again.')
    }
  }

  const handleSaveCatalog = async () => {
    try {
      const response = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ products }),
      })
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          window.sessionStorage.removeItem(adminTokenStorageKey)
          setAdminToken('')
          setIsLoggedIn(false)
        }

        setCatalogSaveMessage(data.message || 'Catalog save failed.')
        return
      }

      setProducts(data.products)
      setHasCatalogChanges(false)
      setCatalogSaveMessage('Catalog saved to SQLite. Public website is updated.')
    } catch {
      setCatalogSaveMessage('API unavailable. Catalog was not saved.')
    }
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
        passcodeIsSet={adminConfigured}
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
