import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { User, Package, Heart, Gear, ShoppingBag, Crown } from '@phosphor-icons/react'
import { useCurrency } from '@/lib/currency'

export function AccountPage() {
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
            My <span className="gradient-text-gold-blue">Account</span>
          </h1>
          
          <p className="text-xl text-white leading-relaxed text-enhanced-light">
            Manage your anime vault, orders, and preferences
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-black/40 backdrop-blur-sm">
              <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-gold data-[state=active]:text-white">
                <User size={16} />
                Profile
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-gold data-[state=active]:text-white">
                <Package size={16} />
                Orders
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-gold data-[state=active]:text-white">
                <Heart size={16} />
                Wishlist
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-gold data-[state=active]:text-white">
                <Gear size={16} />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card className="p-8 bg-black/40 backdrop-blur-sm border-gold/20">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold to-blue-500 flex items-center justify-center">
                    <Crown size={40} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold gradient-text-primary">Otaku Legend</h2>
                    <p className="text-white text-enhanced-light">Member since 2023</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Username</label>
                    <Input placeholder="Your username" className="bg-black/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Email</label>
                    <Input placeholder="your.email@example.com" className="bg-black/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">First Name</label>
                    <Input placeholder="First name" className="bg-black/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Last Name</label>
                    <Input placeholder="Last name" className="bg-black/20" />
                  </div>
                </div>
                
                <Button className="mt-6 bg-gold hover:bg-gold/90 text-black font-semibold">
                  Update Profile
                </Button>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <div className="grid gap-4">
                {[1, 2, 3].map((order) => (
                  <Card key={order} className="p-6 bg-black/40 backdrop-blur-sm border-gold/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <ShoppingBag size={24} className="text-gold" />
                        <div>
                          <h3 className="font-semibold text-white">Order #{2024000 + order}</h3>
                          <p className="text-sm text-white/70">Placed on October {10 + order}, 2024</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gold">{format(99.99 * order)}</p>
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                          Delivered
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="wishlist" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <Card key={item} className="p-4 bg-black/40 backdrop-blur-sm border-gold/20">
                    <div className="aspect-square bg-gradient-to-br from-gold/20 to-blue-500/20 rounded-lg mb-4 flex items-center justify-center">
                      <Heart size={32} className="text-gold" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">Anime Figure #{item}</h3>
                    <p className="text-gold font-bold">{format(29.99 + item * 10)}</p>
                    <Button size="sm" className="w-full mt-3 bg-gold hover:bg-gold/90 text-black">
                      Add to Cart
                    </Button>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="p-8 bg-black/40 backdrop-blur-sm border-gold/20">
                <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border border-gold/20 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-white">Email Notifications</h3>
                      <p className="text-sm text-white/70">Receive updates about new releases and orders</p>
                    </div>
                    <Checkbox className="size-6" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gold/20 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-white">SMS Notifications</h3>
                      <p className="text-sm text-white/70">Get shipping updates via SMS</p>
                    </div>
                    <Checkbox className="size-6" />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gold/20 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-white">Marketing Communications</h3>
                      <p className="text-sm text-white/70">Receive special offers and promotions</p>
                    </div>
                    <Checkbox className="size-6" defaultChecked />
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gold/20 mt-6">
                  <Button variant="destructive" className="mr-4">
                    Delete Account
                  </Button>
                  <Button className="bg-gold hover:bg-gold/90 text-black">
                    Save Settings
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}