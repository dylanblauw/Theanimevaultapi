// Square Catalog API - Get Single Product by ID (Vercel Serverless Function)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const process: any

function getEnv(name: string, fallback?: string): string {
  const value = process?.env?.[name]
  return value && value.length > 0 ? value : (fallback || '')
}

const SQUARE_ACCESS_TOKEN = getEnv('SQUARE_ACCESS_TOKEN')

interface SquareProduct {
  id: string
  name: string
  description?: string
  price: number
  originalPrice?: number
  image: string
  images: string[]
  category: string
  categories: Array<{ id: string; name: string; slug: string }>
  inStock: boolean
  featured: boolean
  tags: string[]
  sku: string
  variations: Array<{
    id: string
    name: string
    price: number
    inStock: boolean
    attributes: Record<string, string>
  }>
  rating?: number
  reviewCount?: number
  weight?: string
  dimensions?: {
    length: string
    width: string
    height: string
  }
}

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
    // Fetch specific product from Square Catalog API
    const response = await fetch(`https://connect.squareup.com/v2/catalog/object/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Square-Version': '2023-12-13'
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: 'Product not found' })
      }
      
      const errorText = await response.text()
      console.error('Square API Error:', response.status, errorText)
      return res.status(response.status).json({
        error: 'Square API request failed',
        details: `HTTP ${response.status}: ${errorText}`
      })
    }

  const data = await response.json()
  const item = data.object
  const related = Array.isArray(data.related_objects) ? data.related_objects : []

    if (!item || item.type !== 'ITEM') {
      return res.status(404).json({ error: 'Product not found or invalid type' })
    }

    const itemData = item.item_data
    const variations = itemData?.variations || []
    
    // Get the first variation for base pricing
    const baseVariation = variations[0]
    const baseMoney = baseVariation?.item_variation_data?.price_money
    const basePrice = baseMoney ? baseMoney.amount / 100 : 0 // Convert from cents
    
    // Build image map from related objects
    const imageMap = new Map<string, string>()
    for (const obj of related) {
      if (obj?.type === 'IMAGE' && obj?.image_data?.url && obj?.id) {
        imageMap.set(obj.id, obj.image_data.url)
      }
    }

    // Extract images via image_ids
    const imageIds: string[] = itemData?.image_ids || []
    const images = imageIds.map((id: string) => imageMap.get(id)).filter(Boolean) as string[]
    const primaryImage = images[0] || '/placeholder-product.jpg'
    
    // Extract category
    const categoryId = itemData?.category_id
    const category = categoryId ? 'General' : 'Uncategorized'
    
    // Transform variations
    const productVariations = variations.map((variation: any) => {
      const variationData = variation.item_variation_data
      const priceMoney = variationData?.price_money
      const price = priceMoney ? priceMoney.amount / 100 : 0
      
      return {
        id: variation.id,
        name: variationData?.name || 'Default',
        price: price,
        inStock: !variationData?.track_inventory || (variationData?.inventory_alert_threshold || 0) > 0,
        attributes: {
          sku: variationData?.sku || '',
          upc: variationData?.upc || '',
          color: variationData?.color || '',
          size: variationData?.size || ''
        }
      }
    })
    
    const product: SquareProduct = {
      id: item.id,
      name: itemData?.name || 'Unnamed Product',
      description: itemData?.description || '',
      price: basePrice,
      originalPrice: basePrice,
      image: primaryImage,
      images: images,
      category: category,
      categories: [{ id: categoryId || 'general', name: category, slug: category.toLowerCase().replace(/\s+/g, '-') }],
  inStock: productVariations.some((v: any) => v.inStock),
      featured: itemData?.label_color === 'FF0000',
      tags: itemData?.categories || [],
      sku: baseVariation?.item_variation_data?.sku || item.id,
      variations: productVariations,
      rating: 0, // Square doesn't provide ratings
      reviewCount: 0, // Square doesn't provide review counts
      weight: '', // Could be added if available in custom attributes
      dimensions: {
        length: '',
        width: '',
        height: ''
      }
    }

    res.status(200).json({
      data: product
    })

  } catch (error: any) {
    console.error('Square Catalog API Error:', error)
    res.status(500).json({
      error: 'Failed to fetch product from Square',
      details: error.message
    })
  }
}