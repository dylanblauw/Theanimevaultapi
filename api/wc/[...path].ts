// Vercel Serverless Proxy for WooCommerce REST API
// Routes: /api/wc/* -> https://<WC_URL>/wp-json/wc/v3/*
// Uses Basic Auth with server-side env vars so secrets are NOT exposed to the browser.

// Local editor hint: we don't include Node types in this project tsconfig; declare minimal globals
// to avoid red squiggles. Vercel's runtime provides real implementations.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const process: any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Buffer: any

function getEnv(name: string, fallback?: string) {
  const v = process.env[name]
  return v && v.length > 0 ? v : fallback
}

// Support multiple possible variable names so it works with your current Vercel setup
const WC_URL = getEnv('WOOCOMMERCE_URL', getEnv('VITE_WOOCOMMERCE_URL', getEnv('NEXT_PUBLIC_WC_URL')))
const WC_CK = getEnv('WOOCOMMERCE_CONSUMER_KEY', getEnv('VITE_WOOCOMMERCE_CONSUMER_KEY'))
const WC_CS = getEnv('WOOCOMMERCE_CONSUMER_SECRET', getEnv('VITE_WOOCOMMERCE_CONSUMER_SECRET'))

// Note: We avoid importing @vercel/node types to keep local editors happy without extra dev deps.
export default async function handler(req: any, res: any) {
  if (!WC_URL || !WC_CK || !WC_CS) {
    return res.status(500).json({
      error: 'WooCommerce proxy misconfigured',
      details: 'Missing WC_URL or consumer key/secret in environment variables.'
    })
  }

  try {
    const pathParts = ([] as string[]).concat((req.query.path as any) || [])
    const subPath = pathParts.join('/')

  const base = WC_URL.replace(/\/$/, '')
  const target = new URL(`${base}/wp-json/wc/v3/${subPath}`)

    // Forward query params (except our dynamic catch-all key "path")
    const qp = { ...req.query } as Record<string, any>
    delete qp.path
    for (const [key, value] of Object.entries(qp)) {
      if (Array.isArray(value)) {
        value.forEach((v) => target.searchParams.append(key, String(v)))
      } else if (value !== undefined) {
        target.searchParams.set(key, String(value))
      }
    }

  const basicAuth = Buffer.from(`${WC_CK}:${WC_CS}`).toString('base64')

    // Prepare request init
    const init: any = {
      method: req.method,
      headers: {
        // Keep Basic header for hosts that accept it
        'Authorization': `Basic ${basicAuth}`,
        'Accept': 'application/json',
        // Only set content-type if body exists; fetch will add boundary for form-data otherwise
        ...(req.body ? { 'Content-Type': req.headers['content-type'] || 'application/json' } : {})
      },
      // For GET/HEAD no body
      body: typeof req.body === 'string' || Buffer.isBuffer(req.body)
        ? (req.method === 'GET' || req.method === 'HEAD' ? undefined : (req.body as any))
        : (req.method === 'GET' || req.method === 'HEAD' ? undefined : JSON.stringify(req.body))
    }

  // Add credentials also as query parameters (more compatible with some WooCommerce/host setups)
  target.searchParams.set('consumer_key', WC_CK)
  target.searchParams.set('consumer_secret', WC_CS)

  const response = await fetch(target.toString(), init)
    const contentType = response.headers.get('content-type') || 'application/json'

    // Pass through status and key headers useful for pagination
    const exposeHeaders = ['x-wp-total', 'x-wp-totalpages']
    exposeHeaders.forEach((h) => {
      const v = response.headers.get(h)
      if (v) res.setHeader(h, v)
    })

    res.setHeader('Content-Type', contentType)

    if (contentType.includes('application/json')) {
      const data = await response.json()
      return res.status(response.status).json(data)
    } else {
      const buf = Buffer.from(await response.arrayBuffer())
      return res.status(response.status).send(buf)
    }
  } catch (err: any) {
    console.error('WooCommerce proxy error:', err)
    return res.status(502).json({
      error: 'WooCommerce proxy request failed',
      details: err?.message || 'Unknown error'
    })
  }
}
