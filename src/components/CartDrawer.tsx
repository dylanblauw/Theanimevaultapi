import { X, Plus, Minus, Trash } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer'
import { Separator } from '@/components/ui/separator'
import { CartItem } from '@/lib/types'

interface CartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: CartItem[]
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemoveItem: (productId: string) => void
}

export function CartDrawer({ open, onOpenChange, items, onUpdateQuantity, onRemoveItem }: CartDrawerProps) {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <DrawerTitle>Shopping Cart ({items.length})</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X weight="bold" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-4">
                <div className="text-4xl">🛒</div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-4">Add some amazing anime merchandise!</p>
              <DrawerClose asChild>
                <Button className="bg-gold text-gold-foreground hover:bg-gold/90">
                  Browse Products
                </Button>
              </DrawerClose>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 p-4 rounded-lg bg-card border border-border">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm line-clamp-2 mb-1">
                      {item.product.name}
                    </h4>
                    <p className="text-gold font-bold">${item.product.price}</p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                      >
                        <Minus size={14} weight="bold" />
                      </Button>
                      
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus size={14} weight="bold" />
                      </Button>
                      
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 ml-auto text-destructive hover:text-destructive"
                        onClick={() => onRemoveItem(item.product.id)}
                      >
                        <Trash size={16} weight="bold" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border p-6 space-y-4 bg-card">
            <div className="flex items-center justify-between text-lg">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-gold text-2xl">${total.toFixed(2)}</span>
            </div>
            
            <Separator />
            
            <Button className="w-full bg-gold text-gold-foreground hover:bg-gold/90 h-12 text-base font-semibold">
              Proceed to Checkout
            </Button>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  )
}
