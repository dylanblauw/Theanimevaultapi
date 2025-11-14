// Square Catalog API - Alias endpoint for single product by ID
// Delegates to the same logic as /api/products/[id]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const process: any

function getEnv(name: string, fallback?: string): string {
  const value = process?.env?.[name]
  return value && value.length > 0 ? value : (fallback || '')
}

const SQUARE_ACCESS_TOKEN = getEnv('SQUARE_ACCESS_TOKEN')

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query || {}
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Product ID is required' })
  }

  if (!SQUARE_ACCESS_TOKEN) {
    return res.status(500).json({
      error: 'Square API misconfigured',
      details: 'Missing SQUARE_ACCESS_TOKEN in environment variables'
    })
  }

  try {
    // Proxy to Square Catalog API for this single item, returning a normalized product shape
    const upstream = await fetch(`https://connect.squareup.com/v2/catalog/object/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Square-Version': '2023-12-13'
      }
    })

    if (!upstream.ok) {
      if (upstream.status === 404) return res.status(404).json({ error: 'Product not found' })
      const txt = await upstream.text()
      return res.status(upstream.status).json({ error: 'Square API request failed', details: txt })
    }

    const data = await upstream.json()
    const item = data.object
    const related = Array.isArray(data.related_objects) ? data.related_objects : []

    if (!item || item.type !== 'ITEM') return res.status(404).json({ error: 'Product not found or invalid type' })

    const itemData = item.item_data
    const variations = itemData?.variations || []

    // Base price from first variation
    const baseVar = variations[0]
    const baseMoney = baseVar?.item_variation_data?.price_money
    const basePrice = baseMoney ? baseMoney.amount / 100 : 0

    // Images from related_objects
    const imageMap = new Map<string, string>()
    for (const obj of related) {
      if (obj?.type === 'IMAGE' && obj?.image_data?.url && obj?.id) imageMap.set(obj.id, obj.image_data.url)
    }
    const imageIds: string[] = itemData?.image_ids || []
    const images = imageIds.map((id: string) => imageMap.get(id)).filter(Boolean) as string[]

    const categoryId = itemData?.category_id
    const category = categoryId ? 'General' : 'Uncategorized'

    const productVariations = variations.map((v: any) => {
      const vd = v.item_variation_data
      const pm = vd?.price_money
      return {
        id: v.id,
        name: vd?.name || 'Default',
        price: pm ? pm.amount / 100 : 0,
        inStock: !vd?.track_inventory || (vd?.inventory_alert_threshold || 0) > 0,
        attributes: {
          sku: vd?.sku || '',
          upc: vd?.upc || '',
        }
      }
    })

    const product = {
      id: item.id,
      name: itemData?.name || 'Unnamed Product',
      description: itemData?.description || '',
      price: basePrice,
      originalPrice: basePrice,
      image: images[0] || '/placeholder-product.jpg',
      images,
      category,
      categories: [{ id: categoryId || 'general', name: category, slug: category.toLowerCase().replace(/\s+/g, '-') }],
      inStock: productVariations.some((v: any) => v.inStock),
      featured: false,
      tags: [],
      sku: baseVar?.item_variation_data?.sku || item.id,
      variations: productVariations,
    }

    return res.status(200).json({ data: product })
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch product from Square', details: err?.message || 'Unknown error' })
  }
}