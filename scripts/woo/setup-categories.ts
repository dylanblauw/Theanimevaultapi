#!/usr/bin/env ts-node
/*
  Setup WooCommerce categories and assign products by heuristics.

  Requirements:
  - env: WOOCOMMERCE_URL, WOOCOMMERCE_CONSUMER_KEY, WOOCOMMERCE_CONSUMER_SECRET
  - @woocommerce/woocommerce-rest-api is installed (already in package.json)

  Usage (PowerShell):
    $env:WOOCOMMERCE_URL="https://theanimevault.net"; $env:WOOCOMMERCE_CONSUMER_KEY="ck_..."; $env:WOOCOMMERCE_CONSUMER_SECRET="cs_..."; npm run woo:setup-categories
*/

import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api'
// Minimal Node globals for editor friendliness (no @types/node required here)
declare const process: any

const REQUIRED = (name: string) => {
  const v = process.env[name]
  if (!v) throw new Error(`Missing env ${name}`)
  return v
}

const api = new WooCommerceRestApi({
  url: REQUIRED('WOOCOMMERCE_URL'),
  consumerKey: REQUIRED('WOOCOMMERCE_CONSUMER_KEY'),
  consumerSecret: REQUIRED('WOOCOMMERCE_CONSUMER_SECRET'),
  version: 'wc/v3',
})

const desiredCategories = [
  'Gaming',
  'Apparel',
  'Back to School',
  'Accessories',
  "Prints & Posters",
]

const keywordMap: Record<string, string[]> = {
  'Gaming': ['game', 'modpack', 'controller', 'dlc', 'server'],
  'Apparel': ['shirt', 't-shirt', 'hoodie', 'hooded', 'sweater', 'cap', 'hat', 'wear', 'apparel'],
  'Back to School': ['backpack', 'pencil', 'notebook', 'school', 'stationery'],
  'Accessories': ['keychain', 'key ring', 'mug', 'cup', 'sticker', 'pin', 'badge', 'accessor'],
  'Prints & Posters': ['poster', 'print', 'canvas', 'art print'],
}

function guessCategory(name: string): string | null {
  const lower = name.toLowerCase()
  for (const [cat, words] of Object.entries(keywordMap)) {
    if (words.some((w) => lower.includes(w))) return cat
  }
  return null
}

async function fetchAll<T>(endpoint: string, params: any = {}): Promise<T[]> {
  const per_page = 100
  let page = 1
  const out: T[] = []
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data, headers } = await api.get(endpoint, { per_page, page, ...params })
    out.push(...(data as T[]))
    const totalPages = parseInt(String(headers['x-wp-totalpages'] || '1'), 10)
    if (page >= totalPages) break
    page += 1
  }
  return out
}

async function ensureCategories() {
  const existing = await fetchAll<any>('products/categories')
  const byName = new Map(existing.map((c) => [String(c.name).toLowerCase(), c]))

  const created: any[] = []
  for (const name of desiredCategories) {
    const key = name.toLowerCase()
    if (!byName.has(key)) {
      const { data } = await api.post('products/categories', { name })
      created.push(data)
      byName.set(key, data)
      console.log(`Created category: ${name} (id: ${data.id})`)
    } else {
      console.log(`Category exists: ${name} (id: ${byName.get(key).id})`)
    }
  }
  const finalList = desiredCategories.map((n) => byName.get(n.toLowerCase()))
  return { byName, list: finalList }
}

async function assignProducts(byName: Map<string, any>) {
  const products = await fetchAll<any>('products')
  let updated = 0
  for (const p of products) {
    const currentCats = Array.isArray(p.categories) ? p.categories.map((c: any) => String(c.name)) : []
    const guess = guessCategory(String(p.name))
    if (!guess) continue
    if (currentCats.includes(guess)) continue

    const target = byName.get(guess.toLowerCase())
    if (!target) continue

    const newCats = [...(p.categories || [])]
    newCats.push({ id: target.id })
    try {
      await api.put(`products/${p.id}`, { categories: newCats })
      updated++
      console.log(`Assigned '${guess}' to product ${p.id} - ${p.name}`)
    } catch (e: any) {
      console.warn(`Failed to assign category for product ${p.id}:`, e?.response?.data || e?.message)
    }
  }
  console.log(`Updated ${updated} products with categories.`)
}

async function main() {
  try {
    const { byName } = await ensureCategories()
    await assignProducts(byName)
    console.log('Done.')
  } catch (err: any) {
    console.error('Setup failed:', err?.response?.data || err?.message || err)
    process.exitCode = 1
  }
}

main()
