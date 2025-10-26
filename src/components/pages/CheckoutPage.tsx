import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { CreditCard, MapPin, User, ShoppingBag, CheckCircle } from '@phosphor-icons/react'
import { useCurrency } from '@/lib/currency'

export function CheckoutPage() {
  const { format } = useCurrency()
  return (
    <div className="min-h-screen py-12 bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="gradient-text-animated">Checkout</span>
          </h1>
          
          <p className="text-xl text-white leading-relaxed text-enhanced-light">
            Complete your order and join the anime vault
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <Card className="p-8 bg-black/40 backdrop-blur-sm border-gold/20">
            <div className="space-y-8">
              {/* Shipping Information */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gold to-blue-500 flex items-center justify-center">
                    <MapPin size={20} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold gradient-text-gold-blue">Shipping Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">First Name</label>
                    <Input placeholder="First name" className="bg-black/20 border-gold/20 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Last Name</label>
                    <Input placeholder="Last name" className="bg-black/20 border-gold/20 text-white" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-white mb-2">Email</label>
                    <Input placeholder="your.email@example.com" className="bg-black/20 border-gold/20 text-white" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-white mb-2">Address</label>
                    <Input placeholder="Street address" className="bg-black/20 border-gold/20 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">City</label>
                    <Input placeholder="City" className="bg-black/20 border-gold/20 text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Postal Code</label>
                    <Input placeholder="Postal code" className="bg-black/20 border-gold/20 text-white" />
                  </div>
                </div>
              </div>

              <Separator className="bg-gold/20" />

              {/* Payment Information */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-gold flex items-center justify-center">
                    <CreditCard size={20} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold gradient-text-blue-gold">Payment Information</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Card Number</label>
                    <Input placeholder="1234 5678 9012 3456" className="bg-black/20 border-gold/20 text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Expiry Date</label>
                      <Input placeholder="MM/YY" className="bg-black/20 border-gold/20 text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">CVV</label>
                      <Input placeholder="123" className="bg-black/20 border-gold/20 text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Cardholder Name</label>
                    <Input placeholder="Name on card" className="bg-black/20 border-gold/20 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Order Summary */}
          <Card className="p-8 bg-black/40 backdrop-blur-sm border-gold/20 h-fit">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gold to-blue-500 flex items-center justify-center">
                <ShoppingBag size={20} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold gradient-text-primary">Order Summary</h2>
            </div>

            <div className="space-y-4">
              {/* Sample order items */}
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center gap-4 p-4 bg-black/20 rounded-lg border border-gold/10">
                  <div className="w-16 h-16 bg-gradient-to-br from-gold/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-gold font-bold">#{item}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">Anime Figure Collection #{item}</h3>
                    <p className="text-sm text-white/70">Quantity: 1</p>
                  </div>
                  <div className="text-gold font-bold">{format(49.99 + item * 10)}</div>
                </div>
              ))}
            </div>

            <Separator className="my-6 bg-gold/20" />

            <div className="space-y-3">
              <div className="flex justify-between text-white">
                <span>Subtotal</span>
                <span>{format(189.97)}</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Shipping</span>
                <span>{format(9.99)}</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Tax</span>
                <span>{format(19.99)}</span>
              </div>
              <Separator className="bg-gold/20" />
              <div className="flex justify-between text-xl font-bold">
                <span className="text-white">Total</span>
                <span className="gradient-text-primary">{format(219.95)}</span>
              </div>
            </div>

            <Button className="w-full mt-8 h-14 text-lg font-bold bg-gradient-to-r from-gold via-yellow-400 to-gold hover:from-yellow-400 hover:via-gold hover:to-yellow-400 text-black shadow-lg shadow-gold/50 hover:shadow-xl hover:shadow-gold/70 transition-all duration-300">
              <CheckCircle size={24} className="mr-2" />
              Complete Order
            </Button>

            <p className="text-center text-sm text-white/70 mt-4">
              Your payment information is secure and encrypted
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}