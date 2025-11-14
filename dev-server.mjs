// Local Development API Server
// This provides a local proxy to test Square API integration during development
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN
const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID

// Products endpoint
app.get('/api/products', async (req, res) => {
  console.log('📨 Incoming request to /api/products')
  console.log('   Query params:', req.query)
  
  if (!SQUARE_ACCESS_TOKEN) {
    console.error('❌ Missing SQUARE_ACCESS_TOKEN')
    return res.status(500).json({
      error: 'Square API misconfigured',
      details: 'Missing SQUARE_ACCESS_TOKEN in environment variables'
    })
  }

  try {
    console.log('🔄 Fetching from Square Catalog API...')
    const response = await fetch('https://connect.squareup.com/v2/catalog/list', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Square-Version': '2023-12-13'
      }
    })

    console.log(`✅ Square API responded with status: ${response.status}`)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Square API Error:', response.status, errorText)
      return res.status(response.status).json({
        error: 'Square API request failed',
        details: `HTTP ${response.status}: ${errorText}`
      })
    }

    const data = await response.json()
    console.log(`📦 Received ${data.objects?.length || 0} objects from Square`)
    
    // Build image map
    const imageMap = new Map()
    const allObjects = Array.isArray(data.objects) ? data.objects : []
    
    console.log(`🔍 Object types: ${allObjects.map(o => o.type).join(', ')}`)
    
    for (const obj of allObjects) {
      if (obj?.type === 'IMAGE' && obj?.image_data?.url && obj?.id) {
        imageMap.set(obj.id, obj.image_data.url)
      }
    }

    // Filter and transform items
    const items = allObjects.filter(obj => obj.type === 'ITEM') || []
    console.log(`📦 Found ${items.length} ITEM objects out of ${allObjects.length} total objects`)
    
    const products = items.map(item => {
      const itemData = item.item_data
      const variations = itemData?.variations || []
      const baseVariation = variations[0]
      const baseMoney = baseVariation?.item_variation_data?.price_money
      const basePrice = baseMoney ? baseMoney.amount / 100 : 0
      
      const imageIds = itemData?.image_ids || []
      const images = imageIds.map(id => imageMap.get(id)).filter(Boolean)
      const primaryImage = images[0] || '/placeholder-product.jpg'
      
      const categoryId = itemData?.category_id
      const category = categoryId ? 'General' : 'Uncategorized'
      
      const productVariations = variations.map(variation => {
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
            upc: variationData?.upc || ''
          }
        }
      })
      
      return {
        id: item.id,
        name: itemData?.name || 'Unnamed Product',
        description: itemData?.description || '',
        price: basePrice,
        originalPrice: basePrice,
        image: primaryImage,
        images: images,
        category: category,
        categories: [{ id: categoryId || 'general', name: category, slug: category.toLowerCase().replace(/\s+/g, '-') }],
        inStock: productVariations.some(v => v.inStock),
        featured: true, // Mark all products as featured by default, or use: itemData?.label_color === 'FF0000'
        tags: itemData?.categories || [],
        sku: baseVariation?.item_variation_data?.sku || item.id,
        variations: productVariations
      }
    })

    // Apply filters
    let filteredProducts = products
    const { search, category, featured, limit = '20', offset = '0' } = req.query

    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase()
      filteredProducts = filteredProducts.filter(product =>
        (product.name || '').toLowerCase().includes(searchLower) ||
        (product.description || '').toLowerCase().includes(searchLower) ||
        (product.tags || []).some(tag => (tag || '').toLowerCase().includes(searchLower))
      )
    }

    if (category && typeof category === 'string') {
      filteredProducts = filteredProducts.filter(product =>
        product.category.toLowerCase() === category.toLowerCase()
      )
    }

    if (featured === 'true') {
      filteredProducts = filteredProducts.filter(product => product.featured)
    }

    const limitNum = parseInt(limit) || 20
    const offsetNum = parseInt(offset) || 0
    const paginatedProducts = filteredProducts.slice(offsetNum, offsetNum + limitNum)

    console.log(`✨ Returning ${paginatedProducts.length} products`)
    if (paginatedProducts.length > 0) {
      console.log(`   First product: "${paginatedProducts[0].name}" - €${paginatedProducts[0].price}`)
    }

    res.json({
      data: paginatedProducts,
      total: filteredProducts.length,
      limit: limitNum,
      offset: offsetNum,
      hasMore: offsetNum + limitNum < filteredProducts.length
    })

  } catch (error) {
    console.error('Square Catalog API Error:', error)
    res.status(500).json({
      error: 'Failed to fetch products from Square',
      details: error.message
    })
  }
})

// Single product endpoint
app.get('/api/product/:id', async (req, res) => {
  if (!SQUARE_ACCESS_TOKEN) {
    return res.status(500).json({
      error: 'Square API misconfigured',
      details: 'Missing SQUARE_ACCESS_TOKEN in environment variables'
    })
  }

  const { id } = req.params

  try {
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
      const errorText = await response.text()
      console.error('Square API Error:', response.status, errorText)
      return res.status(response.status).json({
        error: 'Square API request failed',
        details: `HTTP ${response.status}: ${errorText}`
      })
    }

    const data = await response.json()
    // Transform and return single product (simplified for brevity)
    res.json({ data: data.object })

  } catch (error) {
    console.error('Square Catalog API Error:', error)
    res.status(500).json({
      error: 'Failed to fetch product from Square',
      details: error.message
    })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Local API server running on http://localhost:${PORT}`)
  console.log(`📦 Products endpoint: http://localhost:${PORT}/api/products`)
  console.log(`🔑 Using Square Access Token: ${SQUARE_ACCESS_TOKEN ? '✓ Found' : '✗ Missing'}`)
  console.log(`📍 Using Square Location ID: ${SQUARE_LOCATION_ID || 'Not set'}`)
})
