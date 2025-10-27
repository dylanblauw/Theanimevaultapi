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

  // Load products from WooCommerce
  const loadProducts = async (page = 1) => {
    setLoading(true)
    setError(null)
    try {
      const params: any = { 
        per_page: 12,
        page,
        orderby: 'menu_order',
        order: 'asc'
      }
      
      if (searchQuery) params.search = searchQuery
      if (selectedCategory) params.category = selectedCategory
      
      const result = await wooCommerceService.getProducts(params)
      // Defensive: handle unexpected response shapes gracefully
      const list = Array.isArray(result.data) ? result.data : []
      if (!Array.isArray(result.data)) {
        // Surface a clearer message in the UI
        console.error('Unexpected WooCommerce response:', result)
        throw new Error(
          typeof (result as any)?.data?.message === 'string'
            ? (result as any).data.message
            : 'Onverwachte API-respons (geen lijst met producten)'
        )
      }
      const convertedProducts = list.map(convertWooCommerceProduct)
      
      setProducts(convertedProducts)
      setTotalPages(result.totalPages)
      setCurrentPage(page)
    } catch (err: any) {
      setError(err.message || 'Failed to load products')
      console.error('Error loading products:', err)
    } finally {
      setLoading(false)
    }
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
    }
  }

  // Initial load
  useEffect(() => {
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
                <option key={category.id} value={category.id}>
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