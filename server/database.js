import Database from 'better-sqlite3'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { initialProducts } from '../src/data/products.js'

const defaultDataDir = path.join(process.cwd(), 'data')
const dataDir = process.env.DATA_DIR || defaultDataDir
const databasePath =
  process.env.SQLITE_PATH || path.join(dataDir, 'flixbuzz.sqlite')

fs.mkdirSync(path.dirname(databasePath), { recursive: true })

export const db = new Database(databasePath)
db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    logo_key TEXT,
    category TEXT NOT NULL,
    duration INTEGER NOT NULL,
    price INTEGER NOT NULL DEFAULT 0,
    global_price INTEGER,
    three_month_price INTEGER,
    tag TEXT,
    tone TEXT,
    availability TEXT NOT NULL DEFAULT 'Available',
    description TEXT,
    features TEXT NOT NULL DEFAULT '[]',
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`)

const productCount = db.prepare('SELECT COUNT(*) AS count FROM products').get()

const insertProduct = db.prepare(`
  INSERT INTO products (
    id,
    name,
    logo_key,
    category,
    duration,
    price,
    global_price,
    three_month_price,
    tag,
    tone,
    availability,
    description,
    features
  )
  VALUES (
    @id,
    @name,
    @logoKey,
    @category,
    @duration,
    @price,
    @globalPrice,
    @threeMonthPrice,
    @tag,
    @tone,
    @availability,
    @description,
    @features
  )
`)

if (productCount.count === 0) {
  const seedProducts = db.transaction((products) => {
    products.forEach((product) => {
      insertProduct.run({
        ...product,
        globalPrice: product.globalPrice ?? null,
        threeMonthPrice: product.threeMonthPrice ?? null,
        features: JSON.stringify(product.features ?? []),
      })
    })
  })

  seedProducts(initialProducts)
}

const rowToProduct = (row) => ({
  id: row.id,
  name: row.name,
  logoKey: row.logo_key,
  category: row.category,
  duration: row.duration,
  price: row.price,
  globalPrice: row.global_price ?? undefined,
  threeMonthPrice: row.three_month_price ?? undefined,
  tag: row.tag,
  tone: row.tone,
  availability: row.availability,
  description: row.description,
  features: JSON.parse(row.features || '[]'),
})

export const getProducts = () =>
  db
    .prepare('SELECT * FROM products ORDER BY id ASC')
    .all()
    .map(rowToProduct)

export const replaceProducts = db.transaction((products) => {
  db.prepare('DELETE FROM products').run()

  products.forEach((product) => {
    insertProduct.run({
      ...product,
      id: Number(product.id),
      duration: Number(product.duration),
      price: Number(product.price) || 0,
      globalPrice: product.globalPrice ?? null,
      threeMonthPrice: product.threeMonthPrice ?? null,
      tag: product.tag || '',
      tone: product.tone || 'new',
      availability: product.availability || 'Available',
      description: product.description || '',
      features: JSON.stringify(product.features ?? []),
    })
  })
})

export const isAdminConfigured = () =>
  Boolean(db.prepare('SELECT id FROM admin_users WHERE id = 1').get())

const hashPassword = (password, salt) =>
  crypto.scryptSync(password, salt, 64).toString('hex')

export const createAdminPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex')
  const passwordHash = hashPassword(password, salt)

  db.prepare(`
    INSERT INTO admin_users (id, password_hash, salt)
    VALUES (1, ?, ?)
  `).run(passwordHash, salt)
}

export const verifyAdminPassword = (password) => {
  const admin = db.prepare('SELECT password_hash, salt FROM admin_users WHERE id = 1').get()

  if (!admin) {
    return false
  }

  const passwordHash = hashPassword(password, admin.salt)
  const expected = Buffer.from(admin.password_hash, 'hex')
  const actual = Buffer.from(passwordHash, 'hex')

  return (
    expected.length === actual.length &&
    crypto.timingSafeEqual(expected, actual)
  )
}
