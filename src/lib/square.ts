// Square Catalog API Service

export interface SquareProduct {
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

// Square service functions
export const squareService = {
  // Get all products via our API endpoint
  async getProducts(params: {
    limit?: number
    offset?: number
    category?: string
    featured?: boolean
    search?: string
  } = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.limit) queryParams.set('limit', params.limit.toString())
      if (params.offset) queryParams.set('offset', params.offset.toString())
      if (params.category) queryParams.set('category', params.category)
      if (params.featured) queryParams.set('featured', 'true')
      if (params.search) queryParams.set('search', params.search)

      const url = `/api/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      
      return {
        data: result.data as SquareProduct[],
        total: result.total,
        limit: result.limit,
        offset: result.offset,
        hasMore: result.hasMore,
        headers: Object.fromEntries(response.headers.entries())
      }
    } catch (error) {
      console.error('Error fetching products from Square:', error)
      throw error
    }
  },

  // Get single product by ID via our API endpoint
  async getProduct(id: string) {
    try {
      const response = await fetch(`/api/product/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Product not found')
        }
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      return result.data as SquareProduct
    } catch (error) {
      console.error('Error fetching product from Square:', error)
      throw error
    }
  },

  // Get featured products
  async getFeaturedProducts(limit: number = 6) {
    return this.getProducts({ featured: true, limit })
  },

  // Get products by category
  async getProductsByCategory(category: string, limit: number = 12) {
    return this.getProducts({ category, limit })
  },

  // Search products
  async searchProducts(query: string, limit: number = 20) {
    return this.getProducts({ search: query, limit })
  },

  // Test API connection
  async testConnection() {
    try {
      const response = await this.getProducts({ limit: 1 })
      return {
        success: true,
        message: 'Square API connection successful',
        data: response.data
      }
    } catch (error: any) {
      console.error('Square API Error:', error)
      return {
        success: false,
        message: 'Square API connection failed',
        error: error.message
      }
    }
  }
}

// Utility function to convert Square product to local Product type
export function convertSquareProduct(squareProduct: SquareProduct) {
  // The Square product is already in our desired format, but we can add any transformations here
  return {
    id: squareProduct.id,
    name: squareProduct.name,
    price: squareProduct.price,
    originalPrice: squareProduct.originalPrice || squareProduct.price,
    image: squareProduct.image,
    images: squareProduct.images,
    category: squareProduct.category,
    categories: squareProduct.categories,
    inStock: squareProduct.inStock,
    featured: squareProduct.featured,
    description: squareProduct.description || '',
    shortDescription: squareProduct.description && squareProduct.description.length > 150 
      ? squareProduct.description.substring(0, 150) + '...' 
      : squareProduct.description || '',
    tags: squareProduct.tags,
    sku: squareProduct.sku,
    weight: squareProduct.weight || '',
    dimensions: squareProduct.dimensions || {
      length: '',
      width: '',
      height: ''
    },
    rating: squareProduct.rating || 0,
    reviewCount: squareProduct.reviewCount || 0,
    onSale: squareProduct.originalPrice ? squareProduct.price < squareProduct.originalPrice : false,
    stockQuantity: squareProduct.variations.reduce((total, variation) => 
      total + (variation.inStock ? 1 : 0), 0
    ),
    variations: squareProduct.variations
  }
}

// Export types and service as default
export type Product = SquareProduct
export default squareService