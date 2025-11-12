// Read multiple possible env names so it works with Vercel setups that use NEXT_PUBLIC_* as well
const envVars = ((import.meta as any).env || {}) as Record<string, string | undefined>
function getEnvVar(...keys: string[]) {
  for (const k of keys) {
    const v = envVars[k]
    if (typeof v === 'string' && v.length > 0) return v
  }
  return ''
}

// Get SHOP_ID from environment or URL
const SHOP_ID = getEnvVar(
  'VITE_WOOCOMMERCE_URL',
  'NEXT_PUBLIC_WOOCOMMERCE_URL',
  'NEXT_PUBLIC_WC_URL'
)
async function getViaProxy<T = any>(path: string, options?: { params?: Record<string, any> }) {
  // Always route through our serverless proxy to avoid CORS and keep secrets server-side
  const base = '/api/wc'
  const fullPath = path.startsWith('/') ? path : `/${path}`
  let url = `${base}${fullPath}`

  // Serialize query params if provided
  if (options?.params && Object.keys(options.params).length > 0) {
    const u = new URL(url, window.location.origin)
    for (const [k, v] of Object.entries(options.params)) {
      if (v == null) continue
      if (Array.isArray(v)) {
        v.forEach((vv) => u.searchParams.append(k, String(vv)))
      } else {
        u.searchParams.set(k, String(v))
      }
    }
    url = u.pathname + u.search
  }

  const response = await fetch(url, { method: 'GET' })
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`Proxy HTTP ${response.status} ${response.statusText} - ${text}`)
  }
  const data = await response.json().catch(() => null)
  return {
    data,
    headers: Object.fromEntries(response.headers.entries()),
    status: response.status,
    statusText: response.statusText
  }
}

export interface PrintifyProduct {
  id: string
  title: string
  description: string
  tags: string[]
  options: Array<{
    name: string
    type: string
    values: Array<{
      id: number
      title: string
    }>
  }>
  variants: Array<{
    id: number
    price: number
    is_enabled: boolean
    is_default: boolean
    is_available: boolean
    options: Record<string, number>
    quantity: number
  }>
  images: Array<{
    src: string
    variant_ids: number[]
    position: string
    is_default: boolean
  }>
  created_at: string
  updated_at: string
  visible: boolean
  is_locked: boolean
  blueprint_id: number
  user_id: number
  shop_id: number
  print_provider_id: number
  print_areas: Array<{
    variant_ids: number[]
    placeholders: Array<{
      position: string
      images: Array<{
        id: string
        name: string
        type: string
        height: number
        width: number
        x: number
        y: number
        scale: number
        angle: number
      }>
    }>
  }>
  print_details: any[]
  sales_channel_properties: any[]
  twodaydelivery_enabled: boolean
  shipping_template: any
  external: {
    id: string
    handle: string
  }
}

//  service functions (renamed to printifyService for clarity)
export const printifyService = {
  // Get all products
  async getProducts(params: {
    per_page?: number
    page?: number
    category?: string
    featured?: boolean
    on_sale?: boolean
    search?: string
    orderby?: 'date' | 'id' | 'include' | 'title' | 'slug' | 'price' | 'popularity' | 'rating'
    order?: 'asc' | 'desc'
  } = {}) {
    try {
      // Route through proxy: it maps /products -> /shops/{SHOP_ID}/products.json
      const response = await getViaProxy(`/products`, { params })
      // Printify returns { data: ProductArray }, extract the data array
      const products = Array.isArray(response.data?.data) ? response.data.data : 
                      Array.isArray(response.data) ? response.data : []
      
      return {
        data: products as PrintifyProduct[],
        headers: response.headers as Record<string, string>,
        total: products.length, // Printify doesn't provide separate total count
        totalPages: 1 // All products loaded at once
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  },

  // Get single product
  async getProduct(id: number) {
    try {
      const response = await getViaProxy(`/products/${id}`)
      return response.data as PrintifyProduct
    } catch (error) {
      console.error('Error fetching product:', error)
      throw error
    }
  },

  // Get product categories - Printify doesn't have categories, return mock data
  async getCategories(params: {
    per_page?: number
    page?: number
    search?: string
    orderby?: 'id' | 'include' | 'name' | 'slug' | 'term_group' | 'description' | 'count'
    order?: 'asc' | 'desc'
  } = {}) {
    try {
      // Printify doesn't have a categories endpoint, return predefined categories
      const mockCategories = [
        { id: 1, name: 'Back to School', count: 1, slug: 'back-to-school' },
        { id: 2, name: 'New', count: 2, slug: 'new' },
        { id: 3, name: 'Accessories', count: 1, slug: 'accessories' },
        { id: 4, name: 'Bags', count: 2, slug: 'bags' },
        { id: 5, name: 'Gaming', count: 4, slug: 'gaming' },
        { id: 6, name: 'Journal', count: 2, slug: 'journal' },
        { id: 7, name: 'Shirts', count: 3, slug: 'shirts' },
      ]
      
      return {
        data: mockCategories,
        headers: {} as Record<string, string>,
        total: mockCategories.length,
        totalPages: 1
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  },

  // Get featured products
  async getFeaturedProducts(limit: number = 6) {
    const allProducts = await this.getProducts({ per_page: 100 })
    const featuredProducts = allProducts.data.filter(product => 
      product.tags.includes('featured') || product.tags.includes('Featured')
    )
    
    return {
      data: featuredProducts.slice(0, limit),
      headers: allProducts.headers,
      total: featuredProducts.length,
      totalPages: 1
    }
  },

  // Get products by category - filter by tags since Printify doesn't have categories
  async getProductsByCategory(categoryId: number, limit: number = 12) {
    const categoryNames = {
      1: 'Back to School',
      2: 'New',
      3: 'Accessories', 
      4: 'Bags',
      5: 'Gaming',
      6: 'Journal',
      7: 'Shirts'
    }
    
    const categoryName = categoryNames[categoryId as keyof typeof categoryNames]
    if (!categoryName) {
      return { data: [], headers: {}, total: 0, totalPages: 1 }
    }
    
    const allProducts = await this.getProducts({ per_page: 100 })
    const categoryProducts = allProducts.data.filter(product => 
      product.tags.some(tag => tag.toLowerCase().includes(categoryName.toLowerCase()))
    )
    
    return {
      data: categoryProducts.slice(0, limit),
      headers: allProducts.headers,
      total: categoryProducts.length,
      totalPages: 1
    }
  },

  // Search products
  async searchProducts(query: string, limit: number = 20) {
    const allProducts = await this.getProducts({ per_page: 100 })
    const searchResults = allProducts.data.filter(product =>
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    )
    
    return {
      data: searchResults.slice(0, limit),
      headers: allProducts.headers,
      total: searchResults.length,
      totalPages: 1
    }
  },

  // Test API connection
  async testConnection() {
    try {
      const response = await getViaProxy(`/products`)
      return {
        success: true,
        message: 'API connection successful',
        data: response.data
      }
    } catch (error: any) {
      console.error('Printify API Error:', error)
      return {
        success: false,
        message: 'API connection failed',
        error: error.response?.data || error.message || 'Unknown error'
      }
    }
  }
}

// Utility function to convert Printify product to local Product type
export function convertPrintifyProduct(printifyProduct: PrintifyProduct) {
  // Get the default variant for pricing
  const defaultVariant = printifyProduct.variants.find(v => v.is_default) || printifyProduct.variants[0]
  const price = defaultVariant ? defaultVariant.price / 100 : 0 // Printify prices are in cents
  
  // Get the default image
  const defaultImage = printifyProduct.images.find(img => img.is_default) || printifyProduct.images[0]
  
  // Extract categories from tags (first tag becomes category)
  const category = printifyProduct.tags[0] || 'General'
  const categories = printifyProduct.tags.map((tag, index) => ({
    id: index + 1,
    name: tag,
    slug: tag.toLowerCase().replace(/\s+/g, '-')
  }))

  return {
    id: printifyProduct.id.toString(),
    name: printifyProduct.title,
    price: price,
    originalPrice: price, // Printify doesn't have separate regular/sale prices in basic structure
    image: defaultImage?.src || '/placeholder-product.jpg',
    category: category,
    categories: categories, // Keep full categories array for filtering
    inStock: printifyProduct.variants.some(v => v.is_available && v.quantity > 0),
    featured: printifyProduct.tags.includes('featured') || printifyProduct.tags.includes('Featured'),
    description: printifyProduct.description,
    shortDescription: printifyProduct.description.length > 150 
      ? printifyProduct.description.substring(0, 150) + '...' 
      : printifyProduct.description,
    tags: printifyProduct.tags,
    images: printifyProduct.images.map(img => img.src),
    sku: printifyProduct.id.toString(),
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    rating: 0, // Printify doesn't provide ratings
    reviewCount: 0, // Printify doesn't provide review counts
    onSale: false, // No sale price concept in basic Printify structure
    stockQuantity: printifyProduct.variants.reduce((total, variant) => total + (variant.quantity || 0), 0)
  }
}

// Legacy exports for compatibility - gradually migrate these
export const wooCommerceService = printifyService
export const convertWooCommerceProduct = convertPrintifyProduct
export type WooCommerceProduct = PrintifyProduct