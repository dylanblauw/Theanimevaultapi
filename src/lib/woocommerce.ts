import axios from 'axios'

// Axios instance pointing at the Vite dev proxy.
// In dev, vite.config.ts proxies /api/wc/* -> {WC_URL}/wp-json/wc/v3/* with Basic Auth from server-side env.
// In production, ensure your hosting provides a similar proxy and keep this baseURL the same.
const api = axios.create({
  baseURL: '/api/wc',
  headers: {
    'Accept': 'application/json'
  },
  // withCredentials not needed for Basic auth via proxy; keep false to avoid cookie issues
  withCredentials: false,
})

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
      const response = await api.get('/products', { params })
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
      const response = await api.get(`/products/${id}`)
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
      const response = await api.get('/products/categories', { params })
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
      const response = await api.get('/products', { params: { per_page: 1 } })
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