export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  categories?: Array<{ id: string | number; name: string; slug: string }>
  description: string
  rating: number
  inStock: boolean
  featured?: boolean
  originalPrice?: number
  images?: string[]
  variations?: Array<{
    id: string
    name: string
    price: number
    inStock: boolean
    attributes?: Record<string, string>
  }>
}

export interface CartItem {
  product: Product
  quantity: number
  selectedVariationId?: string
  selectedVariationName?: string
}

export interface Cart {
  items: CartItem[]
  total: number
}
