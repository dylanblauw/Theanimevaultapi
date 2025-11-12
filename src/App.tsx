import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster, toast } from 'sonner'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { CartDrawer } from '@/components/CartDrawer'
import { ProductDetailModal } from '@/components/ProductDetailModal'
import { HomePage } from '@/components/pages/HomePage'
import { WooCommerceShopPage } from '@/components/pages/WooCommerceShopPage'
import { GamePage } from '@/components/pages/GamePage'
import { CheckoutPage } from '@/components/pages/CheckoutPage'
import { AccountPage } from '@/components/pages/AccountPage'
// import { WooCommerceTestPage } from '@/components/pages/WooCommerceTestPage'
import { products as localProducts } from '@/lib/products'
import { Product, CartItem } from '@/lib/types'
import { backgrounds, PageType } from '@/lib/backgrounds'
import { wooCommerceService, convertWooCommerceProduct } from '@/lib/printify'
import { CurrencyProvider } from '@/lib/currency'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cartItems, setCartItems] = useKV<CartItem[]>('cart-items', [])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(
    (localProducts || []).filter(p => p.featured).slice(0, 6)
  )

  const handleAddToCart = (product: Product) => {
    if (!product.inStock) {
      toast.error('This item is currently out of stock')
      return
    }

    setCartItems((currentItems: CartItem[] = []) => {
      const existingItem = currentItems.find(item => item.product.id === product.id)
      
      if (existingItem) {
        toast.success('Updated quantity in cart')
        return currentItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        toast.success('Added to cart')
        return [...currentItems, { product, quantity: 1 }]
      }
    })
  }

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems((currentItems: CartItem[] = []) =>
      currentItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    )
  }

  const handleRemoveItem = (productId: string) => {
    setCartItems((currentItems: CartItem[] = []) => currentItems.filter(item => item.product.id !== productId))
    toast.success('Removed from cart')
  }

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product)
  }

  const cartCount = (cartItems || []).reduce((sum, item) => sum + item.quantity, 0)

  // Load random products from WooCommerce for the Home Featured Collection
  const loadFeaturedFromWoo = async () => {
    try {
      // Fetch a reasonable pool, then sample client-side for randomness
      const { data } = await wooCommerceService.getProducts({ per_page: 24, orderby: 'date', order: 'desc' })
      const converted = data.map(convertWooCommerceProduct)
      const pickRandom = <T,>(arr: T[], n: number) => {
        // Fisher–Yates shuffle (partial)
        const a = arr.slice()
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[a[i], a[j]] = [a[j], a[i]]
        }
        return a.slice(0, n)
      }
      const selection = pickRandom(converted, 6)
      if (selection.length > 0) setFeaturedProducts(selection)
    } catch (err) {
      console.error('Failed to load WooCommerce featured products:', err)
      // Graceful fallback: keep existing local featuredProducts
    }
  }

  // Fetch on first mount
  useState(() => {
    // Slight delay to allow initial render, avoid blocking
    setTimeout(() => {
      loadFeaturedFromWoo()
    }, 0)
    return undefined
  })

  // Get current background image
  const currentBackground = backgrounds[currentPage as PageType] || backgrounds.home

  return (
    <CurrencyProvider>
    <div className="min-h-screen flex flex-col text-foreground relative">
      {/* Dynamic background */}
      <div 
        className="page-background"
        style={{
          backgroundImage: `url(${currentBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      ></div>
      
      <Navbar
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />

      <main className="flex-1 page-content">
        {currentPage === 'home' && (
          <HomePage
            featuredProducts={featuredProducts}
            onAddToCart={handleAddToCart}
            onViewDetails={handleViewDetails}
            onNavigate={setCurrentPage}
          />
        )}
        
        {currentPage === 'shop' && (
          <WooCommerceShopPage
            onAddToCart={handleAddToCart}
            onViewDetails={handleViewDetails}
          />
        )}
        
        {currentPage === 'game' && <GamePage />}
        
        {currentPage === 'checkout' && <CheckoutPage />}
        
        {currentPage === 'account' && <AccountPage />}
        
        {/* {currentPage === 'woocommerce-test' && <WooCommerceTestPage />} */}
      </main>

      <Footer />

      <CartDrawer
        open={cartOpen}
        onOpenChange={setCartOpen}
        items={cartItems || []}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      <ProductDetailModal
        product={selectedProduct}
        open={selectedProduct !== null}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <Toaster position="top-right" richColors />
    </div>
    </CurrencyProvider>
  )
}

export default App