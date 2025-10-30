import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ProductCard } from '@/components/ProductCard'
import { Product } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MagnifyingGlass, CircleNotch, Warning } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { wooCommerceService, convertWooCommerceProduct } from '@/lib/woocommerce'
import { useKV } from '@github/spark/hooks'
import { products as fallbackProducts } from '@/lib/products'

// Override with realistic products based on theanimevault.net REAL analysis
const realisticProducts = [
  // Back to School - Canvas Classic Backpacks 
  {
    id: '1',
    name: 'Otaku On-The-Go: Canvas Classic Backpack',
    price: 68.30,
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80',
    category: 'Back to School',
    description: 'The Anime Enthusiast\'s Canvas Classic Backpack. Perfect for back to school.',
    rating: 4.6,
    inStock: true,
    featured: true
  },
  {
    id: '2',
    name: 'Anime Canvas Backpack - School Edition',
    price: 68.30,
    image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&q=80',
    category: 'Back to School',
    description: 'Perfect canvas backpack for school with anime designs.',
    rating: 4.5,
    inStock: true
  },

  // Journal - D&D and Anime Aesthetic Journals
  {
    id: '3',
    name: 'Unlock Your Creativity: D&D Aesthetic Matte Hardcover Journal',
    price: 22.00,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    category: 'Journal',
    description: 'D&D Aesthetic Matte Hardcover Journal for your creative writing.',
    rating: 4.7,
    inStock: true,
    featured: true
  },
  {
    id: '4',
    name: 'Unlock Your Creativity: Anime Aesthetic Matte Hardcover Journal', 
    price: 22.00,
    image: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=800&q=80',
    category: 'Journal',
    description: 'Anime Aesthetic Matte Hardcover Journal for anime fans.',
    rating: 4.8,
    inStock: true
  },

  // Accessories - Car Seat Covers
  {
    id: '5',
    name: 'Polyester Car Seat Covers',
    price: 90.00,
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80',
    category: 'Accessories',
    description: 'High-quality polyester car seat covers with anime designs.',
    rating: 4.4,
    inStock: true,
    featured: true
  },

  // Gaming - Playmats and LED Mouse Pads
  {
    id: '6',
    name: 'Desk/Gaming Playmat - Anime Edition',
    price: 46.60,
    image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&q=80',
    category: 'Gaming',
    description: 'High-quality gaming playmat with anime design. Perfect for your desk setup.',
    rating: 4.8,
    inStock: true,
    featured: true
  },
  {
    id: '7',
    name: 'Gamer\'s Glow: The Ultimate LED Mouse Pad',
    price: 47.90,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    category: 'Gaming',
    description: 'LED mouse pad with customizable lighting effects. Enhance your gaming experience.',
    rating: 4.9,
    inStock: true,
    featured: true
  },
  {
    id: '8',
    name: 'RGB Gaming Mousepad - Large',
    price: 42.50,
    image: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=800&q=80',
    category: 'Gaming',
    description: 'Large RGB gaming mousepad with smooth surface and anti-slip base.',
    rating: 4.7,
    inStock: true
  },

  // Shirts - Premium Microfiber-Knit Tees
  {
    id: '9',
    name: 'Premium Microfiber-Knit Tee: Dragon Ball Z',
    price: 55.42,
    image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&q=80',
    category: 'Shirts',
    description: 'Premium microfiber tee with Dragon Ball Z design. Available in sizes S-3XL.',
    rating: 4.8,
    inStock: true,
    featured: true
  },
  {
    id: '10',
    name: 'Premium Microfiber-Knit Tee: Naruto',
    price: 55.42,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    category: 'Shirts',
    description: 'Premium microfiber tee with Naruto design. Comfortable and stylish.',
    rating: 4.9,
    inStock: true,
    featured: true
  },
  {
    id: '11',
    name: 'Premium Microfiber-Knit Tee: One Piece',
    price: 55.42,
    image: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=800&q=80',
    category: 'Shirts',
    description: 'Premium microfiber tee with One Piece design. High-quality fabric.',
    rating: 4.7,
    inStock: true
  },

  // Bags - Canvas Backpacks (different from Back to School)
  {
    id: '12',
    name: 'Canvas Classic Backpack - Travel Edition',
    price: 68.30,
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80',
    category: 'Bags',
    description: 'Premium canvas backpack perfect for travel and daily use.',
    rating: 4.6,
    inStock: true
  },

  // New - Mix of newest products
  {
    id: '13',
    name: 'NEW: Limited Edition Gaming Mat',
    price: 52.99,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    category: 'New',
    description: 'Brand new limited edition gaming mat with exclusive anime artwork.',
    rating: 4.9,
    inStock: true,
    featured: true
  },
  {
    id: '14',
    name: 'NEW: Anime Tee Collection 2024',
    price: 58.99,
    image: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=800&q=80',
    category: 'New',
    description: 'Latest addition to our premium tee collection.',
    rating: 4.8,
    inStock: true,
    featured: true
  }
]

interface WooCommerceShopPageProps {
  onAddToCart: (product: Product) => void
  onViewDetails: (product: Product) => void
}

export function WooCommerceShopPage({ onAddToCart, onViewDetails }: WooCommerceShopPageProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pendingCategoryName, setPendingCategoryName] = useKV<string>('shop-category', '')

  // Load products from WooCommerce OR fallback
  const loadProducts = async (page = 1) => {
    setLoading(true)
    setError(null)
    
    try {
      // Try WooCommerce API first
      const params: any = { 
        per_page: 12,
        page,
        orderby: 'menu_order',
        order: 'asc'
      }
      
      if (searchQuery) params.search = searchQuery
      if (selectedCategory) params.category = selectedCategory
      
      const result = await wooCommerceService.getProducts(params)
      const list = Array.isArray(result.data) ? result.data : []
      if (!Array.isArray(result.data)) {
        throw new Error('Invalid API response')
      }
      const convertedProducts = list.map(convertWooCommerceProduct)
      
      setProducts(convertedProducts)
      setTotalPages(result.totalPages)
      setCurrentPage(page)
      
    } catch (err: any) {
      console.error('WooCommerce API failed, using fallback products')
      console.log('=== DEBUGGING FALLBACK ===')
      console.log('Fallback products length:', realisticProducts.length)
      console.log('Selected category:', selectedCategory)
      console.log('Search query:', searchQuery)
      
      // Use fallback products
      let filteredProducts = [...realisticProducts]
      console.log('Initial filtered products:', filteredProducts.length)
      
      // Apply category filter
      if (selectedCategory) {
        const categoryMap: { [key: string]: string } = {
          '1': 'Back to School',
          '2': 'New',
          '3': 'Accessories', 
          '4': 'Bags',
          '5': 'Gaming',
          '6': 'Journal',
          '7': 'Shirts',
        }
        const categoryName = categoryMap[selectedCategory]
        console.log('Category name mapped to:', categoryName)
        if (categoryName) {
          filteredProducts = realisticProducts.filter(p => p.category === categoryName)
          console.log('Products after category filter:', filteredProducts.length)
          console.log('Products found:', filteredProducts.map(p => p.name))
        }
      }
      
      // Apply search filter
      if (searchQuery) {
        filteredProducts = filteredProducts.filter(p =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      
      // Pagination
      const perPage = 12
      const totalItems = filteredProducts.length
      const totalPages = Math.ceil(totalItems / perPage)
      const startIndex = (page - 1) * perPage
      const paginatedProducts = filteredProducts.slice(startIndex, startIndex + perPage)
      
      setProducts(paginatedProducts)
      setTotalPages(totalPages)
      setCurrentPage(page)
      setError(null)
    }
    
    setLoading(false)
  }

  // Load categories from WooCommerce
  const loadCategories = async () => {
    try {
      console.log('Loading categories...')
      const result = await wooCommerceService.getCategories({ per_page: 50 })
      console.log('Categories result:', result)
      
      const desiredOrder = [
        'Gaming',
        'Apparel',
        'Back to School',
        'Accessories',
        'Prints & Posters',
      ]
      const list = Array.isArray(result.data) ? result.data : []
      console.log('Categories list:', list)
      
      // Filter out categories with 0 products
      const activeCategories = list.filter((cat: any) => cat.count > 0)
      
      // Sort by desired order if names match, keep others after
      activeCategories.sort((a: any, b: any) => {
        const ia = desiredOrder.indexOf(a?.name)
        const ib = desiredOrder.indexOf(b?.name)
        if (ia === -1 && ib === -1) return a.name.localeCompare(b.name)
        if (ia === -1) return 1
        if (ib === -1) return -1
        return ia - ib
      })
      
      console.log('Setting categories:', activeCategories)
      setCategories(activeCategories)
      
      // If a category name was chosen from Navbar, select its id
      if (pendingCategoryName) {
        const match = activeCategories.find((c: any) => String(c.name).toLowerCase() === String(pendingCategoryName).toLowerCase())
        if (match) setSelectedCategory(String(match.id))
        setPendingCategoryName('')
      }
    } catch (err: any) {
      console.error('Failed to load categories:', err)
      console.error('Error details:', err.response?.data || err.message)
      
      // Fallback categories for local development when API is not available
      console.log('Using fallback categories for local development')
      const fallbackCategories = [
        { id: 1, name: 'Back to School', count: 1 },
        { id: 2, name: 'New', count: 2 },
        { id: 3, name: 'Accessories', count: 1 },
        { id: 4, name: 'Bags', count: 2 },
        { id: 5, name: 'Gaming', count: 4 },
        { id: 6, name: 'Journal', count: 2 },
        { id: 7, name: 'Shirts', count: 3 },
      ]
      setCategories(fallbackCategories)
    }
  }

  // Initial load
  useEffect(() => {
    console.log('=== INITIAL LOAD DEBUG ===')
      console.log('Fallback products available:', realisticProducts.length)
      console.log('Sample product:', realisticProducts[0])
    loadCategories()
    loadProducts()
  }, [])

  // Reload when filters change
  useEffect(() => {
    // Skip the initial load (already done above)
    if (categories.length > 0) {
      loadProducts(1)
    }
  }, [selectedCategory, searchQuery])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleCategoryChange = (categoryId: string) => {
    console.log('=== CATEGORY CHANGE ===')
    console.log('New category ID:', categoryId)
    const categoryNames = {
      '1': 'Back to School',
      '2': 'New', 
      '3': 'Accessories',
      '4': 'Bags',
      '5': 'Gaming',
      '6': 'Journal', 
      '7': 'Shirts'
    }
    console.log('Category name:', categoryNames[categoryId as keyof typeof categoryNames] || 'All')
    setSelectedCategory(categoryId)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen py-12 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="gradient-text-animated">Anime</span> Shop
          </h1>
          
          <p className="text-xl text-white leading-relaxed text-enhanced-light">
            Discover authentic anime merchandise and exclusive collectibles
          </p>
        </motion.div>

        {/* Search and Filters */}
        <Card className="p-6 bg-black/40 backdrop-blur-sm border-gold/20 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={16} />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 bg-black/20 border-gold/20 text-white placeholder:text-white/50"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="bg-black/20 border border-gold/20 rounded-md px-3 py-2 text-white"
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id.toString()}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
          </div>

          {/* Category Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant={selectedCategory === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryChange('')}
              className={cn(
                selectedCategory === ''
                  ? 'bg-gradient-to-r from-gold to-blue-500 text-white'
                  : 'border-gold/20 text-white hover:border-gold'
              )}
            >
              All
            </Button>
            {categories.slice(0, 6).map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id.toString() ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategoryChange(category.id.toString())}
                className={cn(
                  selectedCategory === category.id.toString()
                    ? 'bg-gradient-to-r from-gold to-blue-500 text-white'
                    : 'border-gold/20 text-white hover:border-gold'
                )}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <CircleNotch className="animate-spin text-gold" size={48} />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="p-8 bg-red-500/10 border-red-500/20 text-center mb-8">
            <Warning className="mx-auto text-red-400 mb-4" size={48} />
            <h3 className="text-xl font-bold text-red-400 mb-2">Error loading products</h3>
            <p className="text-white/70 mb-4">{error}</p>
            <Button
              onClick={() => loadProducts(currentPage)}
              className="bg-gradient-to-r from-gold to-blue-500 text-white"
            >
              Try again
            </Button>
          </Card>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Producten <Badge className="bg-gold text-black ml-2">{products.length}</Badge>
              </h2>
              {totalPages > 1 && (
                <div className="text-white/70">
                  Page {currentPage} of {totalPages}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <motion.div
                    whileHover={{ 
                      scale: 1.03,
                      rotateY: 2,
                    }}
                    transition={{ duration: 0.2 }}
                    className="relative overflow-hidden rounded-xl bg-black/20 backdrop-blur-sm border border-gold/20 hover:border-gold/50 transition-all duration-300"
                  >
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <ProductCard
                      product={product}
                      onAddToCart={onAddToCart}
                      onViewDetails={onViewDetails}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => loadProducts(currentPage - 1)}
                  className="border-gold/20 text-white hover:border-gold"
                >
                  Previous
                </Button>
                
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const page = Math.max(1, currentPage - 2) + i
                  if (page > totalPages) return null
                  
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      onClick={() => loadProducts(page)}
                      className={cn(
                        currentPage === page
                          ? 'bg-gradient-to-r from-gold to-blue-500 text-white'
                          : 'border-gold/20 text-white hover:border-gold'
                      )}
                    >
                      {page}
                    </Button>
                  )
                })}
                
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => loadProducts(currentPage + 1)}
                  className="border-gold/20 text-white hover:border-gold"
                >
                  Next
                </Button>
              </div>
            )}

            {/* Empty State */}
            {products.length === 0 && (
              <Card className="p-12 bg-black/40 backdrop-blur-sm border-gold/20 text-center">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
                <p className="text-white/70">Try adjusting your search or filters</p>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}