export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  categories?: Array<{ id: number; name: string; slug: string }> // For WooCommerce products
  description: string
  rating: number
  inStock: boolean
  featured?: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  total: number
}
