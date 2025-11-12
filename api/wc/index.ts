// Vercel Serverless: /api/wc -> debug endpoint for Printify proxy
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const process: any

function getEnv(name: string, fallback?: string) {
  const v = process.env[name]
  return v && v.length > 0 ? v : fallback
}

const PRINTIFY_API_TOKEN = getEnv('WOOCOMMERCE_CONSUMER_KEY', getEnv('VITE_WOOCOMMERCE_CONSUMER_KEY'))
const SHOP_ID = getEnv('WOOCOMMERCE_URL', getEnv('VITE_WOOCOMMERCE_URL', getEnv('NEXT_PUBLIC_WC_URL')))

export default async function handler(req: any, res: any) {
  const probeUrl = SHOP_ID
    ? `https://api.printify.com/v1/shops/${SHOP_ID}/products.json?limit=1`
    : undefined
  let probe: any = null
  if (probeUrl) {
    try {
      const r = await fetch(probeUrl, {
        headers: { 'Authorization': `Bearer ${PRINTIFY_API_TOKEN}`, 'Accept': 'application/json' }
      })
      const ct = r.headers.get('content-type') || ''
      probe = {
        url: probeUrl,
        status: r.status,
        ok: r.ok,
        contentType: ct,
        bodySample: ct.includes('application/json') ? await r.json() : await r.text(),
      }
    } catch (e: any) {
      probe = { error: e?.message || String(e) }
    }
  }

  return res.status(200).json({
    ok: true,
    shopId: SHOP_ID || null,
    tokenPresent: Boolean(PRINTIFY_API_TOKEN),
    tokenPrefix: PRINTIFY_API_TOKEN ? PRINTIFY_API_TOKEN.slice(0, 10) + '...' : null,
    probe,
  })
}
