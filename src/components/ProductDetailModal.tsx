import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Product } from '@/lib/types'
import { ShoppingCart, Star, Package, ShieldCheck } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface ProductDetailModalProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddToCart: (product: Product) => void
}

export function ProductDetailModal({ product, open, onOpenChange, onAddToCart }: ProductDetailModalProps) {
  if (!product) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-secondary border border-border">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {product.featured && (
              <Badge className="bg-gold text-gold-foreground border-0">
                ⭐ Featured Product
              </Badge>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="border-gold/50 text-gold">
                  {product.category}
                </Badge>
                {!product.inStock && (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>

              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    weight={i < Math.floor(product.rating) ? 'fill' : 'regular'}
                    className={cn(
                      'w-5 h-5',
                      i < Math.floor(product.rating) ? 'text-gold' : 'text-muted-foreground'
                    )}
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-2">
                  {product.rating} out of 5
                </span>
              </div>

              <div className="text-4xl font-bold text-gold mb-6">
                ${product.price}
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6">
                {product.description}
              </p>

              <Button
                size="lg"
                onClick={() => {
                  onAddToCart(product)
                  onOpenChange(false)
                }}
                disabled={!product.inStock}
                className="w-full bg-gold text-gold-foreground hover:bg-gold/90 disabled:opacity-50 h-12 text-base"
              >
                <ShoppingCart weight="bold" className="mr-2" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </div>

            <div className="space-y-3 pt-6 border-t border-border">
              <div className="flex items-center gap-3 text-sm">
                <Package weight="bold" className="text-gold" />
                <span className="text-muted-foreground">Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <ShieldCheck weight="bold" className="text-gold" />
                <span className="text-muted-foreground">100% authentic guaranteed</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Star weight="bold" className="text-gold" />
                <span className="text-muted-foreground">Premium quality collectible</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
