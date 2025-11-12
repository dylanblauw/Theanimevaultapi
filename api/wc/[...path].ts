// Vercel Serverless Proxy for Printify REST API  
// Routes: /api/wc/* -> https://api.printify.com/v1/*
// Uses Bearer Auth with server-side env vars so secrets are NOT exposed to the browser.

// Local editor hint: we don't include Node types in this project tsconfig; declare minimal globals
// to avoid red squiggles. Vercel's runtime provides real implementations.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const process: any

function getEnv(name: string, fallback?: string) {
  const v = process.env[name]
  return v && v.length > 0 ? v : fallback
}

// Support multiple possible variable names so it works with your current Vercel setup
const PRINTIFY_API_TOKEN = getEnv('WOOCOMMERCE_CONSUMER_KEY', getEnv('VITE_WOOCOMMERCE_CONSUMER_KEY'))
const SHOP_ID = getEnv('WOOCOMMERCE_URL', getEnv('VITE_WOOCOMMERCE_URL', getEnv('NEXT_PUBLIC_WC_URL')))

// Note: We avoid importing @vercel/node types to keep local editors happy without extra dev deps.
export default async function handler(req: any, res: any) {
  if (!PRINTIFY_API_TOKEN || !SHOP_ID) {
    return res.status(500).json({
      error: 'Printify proxy misconfigured',
      details: 'Missing PRINTIFY_API_TOKEN or SHOP_ID in environment variables.'
    })
  }

  try {
    // Optional debug: /api/wc?debug=1 — returns env presence and performs a lightweight probe
    if (req.query && (req.query.debug === '1' || req.query.debug === 'true')) {
      const probeUrl = `https://api.printify.com/v1/shops/${SHOP_ID}/products.json?limit=1`
      let probe: any = null
      try {
        const r = await fetch(probeUrl, {
          headers: { 'Authorization': `Bearer ${PRINTIFY_API_TOKEN}`, 'Accept': 'application/json' }
        })
        const contentType = r.headers.get('content-type') || ''
        probe = {
          url: probeUrl,
          status: r.status,
          ok: r.ok,
          contentType,
          bodySample: contentType.includes('application/json') ? await r.json() : await r.text(),
        }
      } catch (e: any) {
        probe = { error: e?.message || String(e) }
      }
      return res.status(200).json({
        ok: true,
        shopId: SHOP_ID,
        tokenPresent: Boolean(PRINTIFY_API_TOKEN),
        tokenPrefix: PRINTIFY_API_TOKEN?.slice(0, 10) + '...',
        probe,
      })
    }

    const pathParts = ([] as string[]).concat((req.query.path as any) || [])
    const subPath = pathParts.join('/')

    // Build Printify API URL
    const base = 'https://api.printify.com/v1'
    let target: string
    
    // Map common WooCommerce paths to Printify equivalents
    if (subPath.includes('products/categories')) {
      // Return mock categories since Printify doesn't have categories
      const mockCategories = [
        { id: 1, name: 'Back to School', count: 1, slug: 'back-to-school' },
        { id: 2, name: 'New', count: 2, slug: 'new' },
        { id: 3, name: 'Accessories', count: 1, slug: 'accessories' },
        { id: 4, name: 'Bags', count: 2, slug: 'bags' },
        { id: 5, name: 'Gaming', count: 4, slug: 'gaming' },
        { id: 6, name: 'Journal', count: 2, slug: 'journal' },
        { id: 7, name: 'Shirts', count: 3, slug: 'shirts' },
      ]
      return res.status(200).json(mockCategories)
    } else if (subPath === 'products' || subPath.startsWith('products/')) {
      // Map to Printify products endpoint
      if (subPath === 'products') {
        target = `${base}/shops/${SHOP_ID}/products.json`
      } else {
        const productId = subPath.replace('products/', '')
        target = `${base}/shops/${SHOP_ID}/products/${productId}.json`
      }
    } else {
      // Default mapping for other endpoints
      target = `${base}/${subPath}`
    }

    // Forward query params (except our dynamic catch-all key "path")
    const qp = { ...req.query } as Record<string, any>
    delete qp.path
    
    if (Object.keys(qp).length > 0) {
      const url = new URL(target)
      for (const [key, value] of Object.entries(qp)) {
        if (Array.isArray(value)) {
          value.forEach((v) => url.searchParams.append(key, String(v)))
        } else if (value !== undefined) {
          url.searchParams.set(key, String(value))
        }
      }
      target = url.toString()
    }

    // Prepare request init with Bearer token
    const init: any = {
      method: req.method,
      headers: {
        'Authorization': `Bearer ${PRINTIFY_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      // For GET/HEAD no body
      body: typeof req.body === 'string'
        ? (req.method === 'GET' || req.method === 'HEAD' ? undefined : req.body)
        : (req.method === 'GET' || req.method === 'HEAD' ? undefined : JSON.stringify(req.body))
    }

  const response = await fetch(target, init)
    const contentType = response.headers.get('content-type') || 'application/json'

    res.setHeader('Content-Type', contentType)

    if (contentType.includes('application/json')) {
      const data = await response.json()
      return res.status(response.status).json(data)
    } else {
      const text = await response.text()
      return res.status(response.status).send(text)
    }
  } catch (err: any) {
    console.error('Printify proxy error:', err)
    return res.status(502).json({
      error: 'Printify proxy request failed',
      details: err?.message || 'Unknown error'
    })
  }
}
