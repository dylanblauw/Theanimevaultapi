import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/ProductCard'
import { Product } from '@/lib/types'
import { ArrowRight, GameController, Users, ShoppingBag } from '@phosphor-icons/react'

interface HomePageProps {
  featuredProducts: Product[]
  onAddToCart: (product: Product) => void
  onViewDetails: (product: Product) => void
  onNavigate: (page: string) => void
}

export function HomePage({ featuredProducts, onAddToCart, onViewDetails, onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-24 md:py-32 bg-black/20 backdrop-blur-sm">
        {/* Dark to transparent gradient overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                textShadow: [
                  "0 0 20px rgba(212, 175, 55, 0.3)",
                  "0 0 40px rgba(212, 175, 55, 0.5)",
                  "0 0 20px rgba(212, 175, 55, 0.3)"
                ]
              }}
              transition={{ 
                duration: 1, 
                delay: 0.2,
                textShadow: { duration: 2, repeat: Infinity }
              }}
              className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
            >
              Welcome to <span className="gradient-text-animated">The Anime Vault</span>
            </motion.h1>
            
            <p className="text-xl md:text-2xl text-white mb-8 leading-relaxed text-enhanced-light">
              Your premier destination for authentic anime merchandise, exclusive collectibles, and the gateway to Otherworlds.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => onNavigate('shop')}
                className="bg-gradient-to-r from-gold via-yellow-400 to-gold text-black hover:from-yellow-400 hover:via-gold hover:to-yellow-400 text-base px-8 h-12 font-bold shadow-lg shadow-gold/50 hover:shadow-xl hover:shadow-gold/70 transition-all duration-300 hover:scale-105"
              >
                <ShoppingBag weight="bold" className="mr-2" />
                Shop Now
                <ArrowRight weight="bold" className="ml-2" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => onNavigate('game')}
                className="border-2 border-blue-500/50 hover:border-blue-400 bg-black/20 hover:bg-blue-500/10 text-white text-base px-8 h-12 font-bold relative overflow-hidden group transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-400/20 to-blue-500/0 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></div>
                <GameController weight="bold" className="mr-2 relative z-10" />
                <span className="relative z-10">Explore Otherworlds</span>
                <div className="absolute inset-0 rounded-md shadow-[0_0_15px_rgba(59,130,246,0.5)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-black/10 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Featured <span className="gradient-text-gold-blue">Collection</span>
            </h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto font-medium">
              Handpicked treasures for every anime adventurer
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    rotateY: 5,
                    rotateX: 5
                  }}
                  transition={{ duration: 0.3 }}
                  className="relative overflow-hidden rounded-xl bg-black/20 backdrop-blur-sm border border-gold/20 hover:border-gold/50 transition-all duration-300"
                >
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <ProductCard
                    product={product}
                    onAddToCart={onAddToCart}
                    onViewDetails={onViewDetails}
                  />
                  
                  {/* Price and name overlay on hover */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                  >
                    <h3 className="text-white font-bold text-lg mb-1">{product.name}</h3>
                    <p className="text-gold font-bold text-xl">€{product.price.toFixed(2)}</p>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigate('shop')}
              className="border-gold/30 hover:border-gold hover:bg-gold/10"
            >
              View All Products
              <ArrowRight weight="bold" className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-primary">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-2xl p-8 hover:border-gold/50 transition-all group"
            >
              <div className="w-16 h-16 rounded-xl bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors">
                <GameController size={32} weight="bold" className="text-gold" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Otherworlds</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Dive into our original anime-inspired game featuring stunning visuals, immersive gameplay, and a captivating story that will keep you engaged for hours.
              </p>
              <Button
                onClick={() => onNavigate('game')}
                className="bg-gold text-gold-foreground hover:bg-gold/90"
              >
                Learn More
                <ArrowRight weight="bold" className="ml-2" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-2xl p-8 hover:border-gold/50 transition-all group"
            >
              <div className="w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <Users size={32} weight="bold" className="text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Join Our Community</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Connect with fellow anime enthusiasts, share your collection, participate in events, and stay updated with the latest releases and exclusive drops.
              </p>
              <Button
                onClick={() => onNavigate('account')}
                variant="outline"
                className="border-accent/30 hover:border-accent hover:bg-accent/10"
              >
                Join Now
                <ArrowRight weight="bold" className="ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
