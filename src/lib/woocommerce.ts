import axios from 'axios'

// Primary: call our server-side proxy
const proxyApi = axios.create({
  baseURL: '/api/wc',
  headers: { 'Accept': 'application/json' },
  withCredentials: false,
})

// Optional fallback: call WooCommerce directly from the browser
// Read multiple possible env names so it works with Vercel setups that use NEXT_PUBLIC_* as well
const envVars = ((import.meta as any).env || {}) as Record<string, string | undefined>
function getEnvVar(...keys: string[]) {
  for (const k of keys) {
    const v = envVars[k]
    if (typeof v === 'string' && v.length > 0) return v
  }
  return ''
}

const DIRECT_URL = getEnvVar(
  'VITE_WOOCOMMERCE_URL',
  'NEXT_PUBLIC_WOOCOMMERCE_URL',
  'NEXT_PUBLIC_WC_URL'
)
const DIRECT_CK = getEnvVar(
  'VITE_WOOCOMMERCE_CONSUMER_KEY',
  'NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY',
  'NEXT_PUBLIC_WC_CK',
  'NEXT_PUBLIC_WC_KEY'
)
const DIRECT_CS = getEnvVar(
  'VITE_WOOCOMMERCE_CONSUMER_SECRET',
  'NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET',
  'NEXT_PUBLIC_WC_CS',
  'NEXT_PUBLIC_WC_SECRET'
)
const hasDirect = Boolean(DIRECT_URL && DIRECT_CK && DIRECT_CS)

const directApi = hasDirect
  ? axios.create({
      baseURL: DIRECT_URL.replace(/\/$/, '') + '/wp-json/wc/v3',
      headers: { 'Accept': 'application/json' },
      withCredentials: false,
      params: {
        consumer_key: DIRECT_CK,
        consumer_secret: DIRECT_CS,
      },
    })
  : null

async function getWithFallback<T = any>(path: string, options?: { params?: any }) {
  // 1) Try server proxy
  try {
    return await proxyApi.get<T>(path, options)
  } catch (err: any) {
    const status = err?.response?.status
    const data = err?.response?.data
    // 2) If proxy blocked (401/403/5xx) and we have direct credentials, try direct request
    if (directApi && (status === 401 || status === 403 || status >= 500)) {
      return await directApi.get<T>(path, options)
    }
    // 3) Rethrow with more details for UI
    const message = typeof data?.message === 'string' ? data.message : err?.message || 'Request failed'
    const error = new Error(message)
    ;(error as any).response = err?.response
    throw error
  }
}

export interface WooCommerceProduct {
  id: number
  name: string
  slug: string
  permalink: string
  date_created: string
  date_modified: string
  type: string
  status: string
  featured: boolean
  catalog_visibility: string
  description: string
  short_description: string
  sku: string
  price: string
  regular_price: string
  sale_price: string
  on_sale: boolean
  purchasable: boolean
  total_sales: number
  virtual: boolean
  downloadable: boolean
  downloads: any[]
  download_limit: number
  download_expiry: number
  external_url: string
  button_text: string
  tax_status: string
  tax_class: string
  manage_stock: boolean
  stock_quantity: number | null
  backorders: string
  backorders_allowed: boolean
  backordered: boolean
  low_stock_amount: number | null
  sold_individually: boolean
  weight: string
  dimensions: {
    length: string
    width: string
    height: string
  }
  shipping_required: boolean
  shipping_taxable: boolean
  shipping_class: string
  shipping_class_id: number
  reviews_allowed: boolean
  average_rating: string
  rating_count: number
  upsell_ids: number[]
  cross_sell_ids: number[]
  parent_id: number
  purchase_note: string
  categories: Array<{
    id: number
    name: string
    slug: string
  }>
  tags: Array<{
    id: number
    name: string
    slug: string
  }>
  images: Array<{
    id: number
    date_created: string
    date_modified: string
    src: string
    name: string
    alt: string
  }>
  attributes: any[]
  default_attributes: any[]
  variations: number[]
  grouped_products: number[]
  menu_order: number
  price_html: string
  related_ids: number[]
  meta_data: any[]
  stock_status: string
  has_options: boolean
  post_password: string
  global_unique_id: string
}

// API service functions
export const wooCommerceService = {
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
  const response = await getWithFallback('/products', { params })
      return {
        data: response.data as WooCommerceProduct[],
        headers: response.headers as Record<string, string>,
        total: parseInt((response.headers as any)['x-wp-total'] || '0'),
        totalPages: parseInt((response.headers as any)['x-wp-totalpages'] || '0')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      throw error
    }
  },

  // Get single product
  async getProduct(id: number) {
    try {
  const response = await getWithFallback(`/products/${id}`)
      return response.data as WooCommerceProduct
    } catch (error) {
      console.error('Error fetching product:', error)
      throw error
    }
  },

  // Get product categories
  async getCategories(params: {
    per_page?: number
    page?: number
    search?: string
    orderby?: 'id' | 'include' | 'name' | 'slug' | 'term_group' | 'description' | 'count'
    order?: 'asc' | 'desc'
  } = {}) {
    try {
  const response = await getWithFallback('/products/categories', { params })
      return {
        data: response.data,
        headers: response.headers as Record<string, string>,
        total: parseInt((response.headers as any)['x-wp-total'] || '0'),
        totalPages: parseInt((response.headers as any)['x-wp-totalpages'] || '0')
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  },

  // Get featured products
  async getFeaturedProducts(limit: number = 6) {
    return this.getProducts({
      featured: true,
      per_page: limit,
      orderby: 'date',
      order: 'desc'
    })
  },

  // Get products by category
  async getProductsByCategory(categoryId: number, limit: number = 12) {
    return this.getProducts({
      category: categoryId.toString(),
      per_page: limit,
      orderby: 'menu_order',
      order: 'asc'
    })
  },

  // Search products
  async searchProducts(query: string, limit: number = 20) {
    return this.getProducts({
      search: query,
      per_page: limit,
      orderby: 'relevance'
    })
  },

  // Test API connection
  async testConnection() {
    try {
  const response = await getWithFallback('/products', { params: { per_page: 1 } })
      return {
        success: true,
        message: 'API connection successful',
        data: response.data
      }
    } catch (error: any) {
      console.error('WooCommerce API Error:', error)
      return {
        success: false,
        message: 'API connection failed',
        error: error.response?.data || error.message || 'Unknown error'
      }
    }
  }
}

// Utility function to convert WooCommerce product to local Product type
export function convertWooCommerceProduct(wooProduct: WooCommerceProduct) {
  return {
    id: wooProduct.id.toString(),
    name: wooProduct.name,
    price: parseFloat(wooProduct.price) || 0,
    originalPrice: parseFloat(wooProduct.regular_price) || parseFloat(wooProduct.price) || 0,
    image: wooProduct.images[0]?.src || '/placeholder-product.jpg',
    category: wooProduct.categories[0]?.name || 'General',
    categories: wooProduct.categories, // Keep full categories array for filtering
    inStock: wooProduct.stock_status === 'instock',
    featured: wooProduct.featured,
    description: wooProduct.description,
    shortDescription: wooProduct.short_description,
    tags: wooProduct.tags.map(tag => tag.name),
    images: wooProduct.images.map(img => img.src),
    sku: wooProduct.sku,
    weight: wooProduct.weight,
    dimensions: wooProduct.dimensions,
    rating: parseFloat(wooProduct.average_rating) || 0,
    reviewCount: wooProduct.rating_count || 0,
    onSale: wooProduct.on_sale,
    stockQuantity: wooProduct.stock_quantity
  }
}