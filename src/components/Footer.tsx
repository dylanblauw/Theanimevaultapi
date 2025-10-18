import { DiscordLogo, TwitterLogo, InstagramLogo, YoutubeLogo } from '@phosphor-icons/react'
import logoImage from '@/assets/logo/New Logo.png'

export function Footer() {
  return (
    <footer className="border-t border-border bg-black/40 backdrop-blur-md mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img 
                src={logoImage} 
                alt="The Anime Vault Logo" 
                className="w-10 h-10 object-cover rounded-full shadow-md shadow-gold/20"
              />
              <span className="font-bold text-lg">The Anime Vault</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your premier destination for authentic anime merchandise and collectibles.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Shop</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-gold cursor-pointer transition-colors">Collectibles</li>
              <li className="hover:text-gold cursor-pointer transition-colors">Apparel</li>
              <li className="hover:text-gold cursor-pointer transition-colors">Accessories</li>
              <li className="hover:text-gold cursor-pointer transition-colors">Art Prints</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-gold cursor-pointer transition-colors">About Us</li>
              <li className="hover:text-gold cursor-pointer transition-colors">Otherworlds Game</li>
              <li className="hover:text-gold cursor-pointer transition-colors">Community</li>
              <li className="hover:text-gold cursor-pointer transition-colors">Contact</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Connect</h3>
            <div className="flex gap-3">
              <button className="w-10 h-10 rounded-lg bg-secondary hover:bg-gold/20 hover:text-gold transition-all flex items-center justify-center">
                <DiscordLogo size={20} weight="fill" />
              </button>
              <button className="w-10 h-10 rounded-lg bg-secondary hover:bg-gold/20 hover:text-gold transition-all flex items-center justify-center">
                <TwitterLogo size={20} weight="fill" />
              </button>
              <button className="w-10 h-10 rounded-lg bg-secondary hover:bg-gold/20 hover:text-gold transition-all flex items-center justify-center">
                <InstagramLogo size={20} weight="fill" />
              </button>
              <button className="w-10 h-10 rounded-lg bg-secondary hover:bg-gold/20 hover:text-gold transition-all flex items-center justify-center">
                <YoutubeLogo size={20} weight="fill" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 The Anime Vault. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
