import { useState } from 'react'
import { motion } from 'framer-motion'
import { ProductCard } from '@/components/ProductCard'
import { Product } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface ShopPageProps {
  products: Product[]
  categories: string[]
  onAddToCart: (product: Product) => void
  onViewDetails: (product: Product) => void
}

export function ShopPage({ products, categories, onAddToCart, onViewDetails }: ShopPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen py-12 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Our <span className="gradient-text-gold-blue">Collection</span>
          </h1>
          <p className="text-lg text-white max-w-2xl text-enhanced-light">
            Browse our curated selection of premium anime merchandise and collectibles
          </p>
        </motion.div>

        <div className="mb-8 space-y-6">
          <div className="relative max-w-md">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} weight="bold" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-card border-border focus:border-gold"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  'transition-all',
                  selectedCategory === category
                    ? 'bg-gold text-gold-foreground hover:bg-gold/90'
                    : 'border-border hover:border-gold hover:bg-gold/10'
                )}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <div className="text-4xl">🔍</div>
            </div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('All')
              }}
              className="border-gold/30 hover:border-gold hover:bg-gold/10"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>

            <div className="mt-8 text-center text-muted-foreground">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          </>
        )}
      </div>
    </div>
  )
}
