import crypto from 'node:crypto'
import express from 'express'
import {
  createAdminPassword,
  getProducts,
  isAdminConfigured,
  replaceProducts,
  verifyAdminPassword,
} from './database.js'

const app = express()
const port = Number(process.env.PORT || 4000)
const sessions = new Set()

app.use(express.json({ limit: '1mb' }))

const createSession = () => {
  const token = crypto.randomBytes(32).toString('hex')
  sessions.add(token)
  return token
}

const requireAdmin = (request, response, next) => {
  const header = request.get('authorization') || ''
  const token = header.replace(/^Bearer\s+/i, '')

  if (!token || !sessions.has(token)) {
    response.status(401).json({ message: 'Admin login required.' })
    return
  }

  next()
}

const validateProduct = (product) => {
  if (!product.name?.trim()) {
    return 'Product name is required.'
  }

  if (!product.category?.trim()) {
    return 'Product category is required.'
  }

  if (!Number.isFinite(Number(product.duration))) {
    return 'Product duration must be a number.'
  }

  if (!Number.isFinite(Number(product.price))) {
    return 'Product price must be a number.'
  }

  return null
}

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, service: 'flixbuzz-api' })
})

app.get('/api/products', (_request, response) => {
  response.json({ products: getProducts() })
})

app.get('/api/admin/status', (_request, response) => {
  response.json({ configured: isAdminConfigured() })
})

app.post('/api/admin/login', (request, response) => {
  const password = String(request.body.password || '').trim()

  if (password.length < 8) {
    response.status(400).json({ message: 'Use at least 8 characters.' })
    return
  }

  if (!isAdminConfigured()) {
    createAdminPassword(password)
    response.json({
      configured: true,
      token: createSession(),
      message: 'Admin passcode created.',
    })
    return
  }

  if (!verifyAdminPassword(password)) {
    response.status(401).json({ message: 'Wrong admin passcode.' })
    return
  }

  response.json({
    configured: true,
    token: createSession(),
    message: 'Admin logged in.',
  })
})

app.put('/api/admin/products', requireAdmin, (request, response) => {
  const products = Array.isArray(request.body.products)
    ? request.body.products
    : []

  if (products.length === 0) {
    response.status(400).json({ message: 'At least one product is required.' })
    return
  }

  const validationError = products.map(validateProduct).find(Boolean)

  if (validationError) {
    response.status(400).json({ message: validationError })
    return
  }

  replaceProducts(products)
  response.json({
    products: getProducts(),
    message: 'Catalog saved.',
  })
})

app.use((error, _request, response, next) => {
  void next
  console.error(error)
  response.status(500).json({ message: 'Unexpected server error.' })
})

app.listen(port, () => {
  console.log(`FlixBuzz API listening on http://localhost:${port}`)
})
