import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GameController, DownloadSimple, Star, Users } from '@phosphor-icons/react'

const DISCORD_INVITE = (import.meta as any).env?.VITE_DISCORD_INVITE || 'https://discord.com/invite/'

export function GamePage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-24 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-2 mb-6">
              <GameController weight="bold" className="text-gold" />
              <span className="text-gold font-semibold">Otherworlds</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Enter the <span className="gradient-text-blue-gold">Otherworlds</span>
            </h1>
            
            <p className="text-xl text-white mb-8 leading-relaxed max-w-2xl text-enhanced-light">
              An anime-inspired RPG adventure featuring stunning visuals, deep character customization, and an epic story that spans multiple dimensions.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <a href={DISCORD_INVITE} target="_blank" rel="noreferrer">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-gold via-yellow-400 to-gold text-black hover:from-yellow-400 hover:via-gold hover:to-yellow-400 text-base px-8 h-12 font-bold shadow-lg shadow-gold/50 hover:shadow-xl hover:shadow-gold/70 transition-all duration-300"
                >
                  <DownloadSimple weight="bold" className="mr-2" />
                  Join Us
                </Button>
              </a>
              
              <Button 
                size="lg"
                variant="outline"
                className="border-gold/30 hover:border-gold hover:bg-gold/10 text-base px-8 h-12"
              >
                Watch Trailer
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="p-6 text-center border-border hover:border-gold/50 transition-all">
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                <Star size={32} weight="fill" className="text-gold" />
              </div>
              <h3 className="text-3xl font-bold mb-2 text-gold">4.9/5</h3>
              <p className="text-muted-foreground">Player Rating</p>
            </Card>

            <Card className="p-6 text-center border-border hover:border-gold/50 transition-all">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Users size={32} weight="fill" className="text-accent" />
              </div>
              <h3 className="text-3xl font-bold mb-2 text-accent">50K+</h3>
              <p className="text-muted-foreground">Active Players</p>
            </Card>

            <Card className="p-6 text-center border-border hover:border-gold/50 transition-all">
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
                <GameController size={32} weight="fill" className="text-gold" />
              </div>
              <h3 className="text-3xl font-bold mb-2 text-foreground">100+</h3>
              <p className="text-muted-foreground">Hours of Content</p>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card className="p-8 border-border">
                <h2 className="text-3xl font-bold mb-4">About the Game</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Otherworlds is an anime-inspired action RPG that combines stunning visual aesthetics with deep gameplay mechanics. 
                    Set in a multiverse where different anime-inspired worlds collide, players embark on an epic journey to restore 
                    balance across dimensions.
                  </p>
                  <p>
                    Choose from multiple character classes, each with unique abilities and playstyles. Master powerful techniques, 
                    forge legendary weapons, and team up with companions as you face increasingly challenging enemies.
                  </p>
                  <p>
                    The game features a rich story mode with branching narratives, competitive PvP arenas, cooperative raids, 
                    and regular content updates that introduce new worlds to explore.
                  </p>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { title: 'Deep Character Customization', desc: 'Create your perfect hero with extensive appearance options and skill trees' },
                  { title: 'Epic Boss Battles', desc: 'Face off against massive bosses inspired by legendary anime fights' },
                  { title: 'Multiplayer Co-op', desc: 'Team up with friends for challenging raids and dungeons' },
                  { title: 'Dynamic Combat System', desc: 'Fast-paced action with combo chains and special abilities' },
                  { title: 'Beautiful Art Style', desc: 'Hand-crafted anime aesthetics with stunning visual effects' },
                  { title: 'Regular Updates', desc: 'New content, events, and features added regularly' }
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="p-6 border-border hover:border-gold/50 transition-all h-full">
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.desc}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="aspect-video bg-gradient-to-br from-primary to-secondary border-border overflow-hidden group cursor-pointer">
                    <div className="w-full h-full flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <GameController size={48} weight="bold" className="text-gold/50 group-hover:text-gold group-hover:scale-110 transition-all" />
                    </div>
                  </Card>
                ))}
              </div>
              <p className="text-center text-muted-foreground">
                Screenshots and trailers coming soon!
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-background to-primary">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Ready to Begin Your <span className="text-gold">Adventure?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of players in the ever-expanding world of Otherworlds
          </p>
          <a href={DISCORD_INVITE} target="_blank" rel="noreferrer">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-gold via-yellow-400 to-gold text-black hover:from-yellow-400 hover:via-gold hover:to-yellow-400 text-base px-12 h-14 font-bold shadow-lg shadow-gold/50 hover:shadow-xl hover:shadow-gold/70 transition-all duration-300"
            >
              <DownloadSimple weight="bold" className="mr-2" size={24} />
              Join Us
            </Button>
          </a>
        </div>
      </section>
    </div>
  )
}
