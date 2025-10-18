# The Anime Vault - Product Requirements Document

A modern, immersive anime merchandise showcase featuring a curated collection of anime-themed products, an original game highlight, and community connection hub.

**Experience Qualities**:
1. **Immersive** - Users should feel transported into an anime universe with rich visuals, glowing accents, and atmospheric design
2. **Premium** - Gold and blue palette conveys exclusivity and quality, making products feel special and collectible
3. **Energetic** - Smooth animations and interactive elements create excitement and engagement throughout the experience

**Complexity Level**: Light Application (multiple features with basic state)
This is a showcase application with product browsing, filtered navigation, and persistent cart/favorites. It demonstrates e-commerce patterns without actual payment processing, focusing on the browsing and discovery experience.

## Essential Features

### Product Showcase Grid
- **Functionality**: Display anime merchandise in responsive card grid with images, titles, prices
- **Purpose**: Allow users to browse the collection efficiently and discover products
- **Trigger**: Automatically loads on homepage and shop page
- **Progression**: Page load → Fetch product data → Render grid → Hover reveals details → Click navigates to product page
- **Success criteria**: Grid displays 12+ products, responsive on mobile, images load smoothly, hover states are engaging

### Product Detail View
- **Functionality**: Full product information with large images, description, add to cart
- **Purpose**: Provide comprehensive product details to drive purchase decisions
- **Trigger**: Click on any product card
- **Progression**: Click card → Navigate to detail page → View image gallery → Read description → Add to cart → Toast confirmation
- **Success criteria**: All product info displayed, image zoom works, add to cart updates state, smooth transitions

### Shopping Cart State
- **Functionality**: Persistent cart using useKV that tracks added items across sessions
- **Purpose**: Allow users to collect items they're interested in
- **Trigger**: Click "Add to Cart" button on product pages
- **Progression**: Add item → Update cart count → View cart drawer → Adjust quantities → See total
- **Success criteria**: Cart persists on refresh, quantities update correctly, totals calculate accurately

### Game Showcase (Otherworlds)
- **Functionality**: Dedicated section highlighting the anime-inspired game with media and description
- **Purpose**: Promote the studio's original game content and drive community interest
- **Trigger**: Navigate to /game route or click game section from home
- **Progression**: Enter page → View hero banner → Read game description → Watch trailer/screenshots → Click CTA links
- **Success criteria**: Visually distinct from store, conveys game atmosphere, clear calls-to-action

### Community Hub
- **Functionality**: Social connection area with Discord invite, social links, fan art showcase
- **Purpose**: Build community engagement and provide social proof
- **Trigger**: Navigate to /community route
- **Progression**: Enter page → View community stats → See featured content → Click Discord invite → Join external community
- **Success criteria**: Links work correctly, community benefits are clear, engaging visual presentation

## Edge Case Handling

- **Empty Cart State**: Show friendly message with "Browse Products" CTA when cart is empty
- **Missing Product Images**: Display placeholder anime-style illustration if image fails to load
- **Long Product Names**: Truncate with ellipsis after 2 lines, show full name in tooltip on hover
- **Slow Data Loading**: Display skeleton loaders that match product card dimensions
- **No Search Results**: Show "No products found" with suggestions to clear filters
- **Mobile Navigation**: Collapse to hamburger menu, cart icon always visible in header
- **Duplicate Cart Additions**: Increment quantity instead of creating duplicate entries

## Design Direction

The design should evoke the feeling of a **premium anime collectibles gallery** - think high-end anime figure displays with dramatic lighting. It should feel energetic yet sophisticated, combining the excitement of anime culture with the polish of a luxury brand. Minimal interface approach serves the product imagery while gold accents and glowing effects add anime-inspired flair.

## Color Selection

**Triadic with Gold Emphasis** - Using deep blue, radiant gold, and rich dark backgrounds to create dramatic contrast and anime-inspired atmosphere.

- **Primary Color (Deep Blue #0C2340)**: Represents trust, depth, and night sky - used for main backgrounds and major UI elements. Communicates professionalism while maintaining anime aesthetic.
- **Secondary Color (Gold #D4AF37)**: Premium accent representing treasure, achievement, and special items. Used sparingly for CTAs, highlights, and hover states to draw attention.
- **Accent Color (Electric Blue #3B82F6)**: Vibrant highlight for interactive elements, creates energy and complements the gold without competing. Used for links, active states, and glowing effects.
- **Foreground/Background Pairings**:
  - Background (Dark Navy #0A1628): Off-white text (#F5F5F7) - Ratio 13.2:1 ✓
  - Card (Deep Blue #0C2340): Off-white text (#F5F5F7) - Ratio 12.8:1 ✓
  - Primary (Deep Blue #0C2340): Off-white text (#F5F5F7) - Ratio 12.8:1 ✓
  - Secondary (Muted Blue #1E3A5F): Light text (#E5E7EB) - Ratio 8.4:1 ✓
  - Accent (Electric Blue #3B82F6): White text (#FFFFFF) - Ratio 4.9:1 ✓
  - Muted (Slate #334155): Light gray text (#D1D5DB) - Ratio 5.2:1 ✓

## Font Selection

**Bold, modern sans-serif that balances readability with anime energy** - using Inter for its excellent legibility and geometric precision, paired with subtle weight variations to create hierarchy.

- **Typographic Hierarchy**:
  - H1 (Site Title/Hero): Inter Bold/48px/tight tracking (-0.02em) - Commands attention
  - H2 (Section Headers): Inter Bold/36px/tight tracking (-0.01em) - Clear section breaks
  - H3 (Product Names): Inter Semibold/20px/normal tracking - Premium but readable
  - Body (Descriptions): Inter Regular/16px/relaxed line-height (1.6) - Comfortable reading
  - Small (Prices, Meta): Inter Medium/14px/normal tracking - Subtle emphasis
  - CTA Buttons: Inter Semibold/16px/wide tracking (0.02em) - Confident actions

## Animations

**Subtle elegance with moments of anime-inspired energy** - animations should feel smooth and purposeful, enhancing the premium feeling while adding playful touches that reflect anime culture. Avoid overwhelming users but reward exploration.

- **Purposeful Meaning**: Glowing effects on gold elements suggest treasure and importance. Smooth slides and fades maintain immersion. Scale transforms on hover make products feel tangible and collectible.
- **Hierarchy of Movement**: Product cards receive primary animation focus (scale, glow). Navigation is secondary (slide, fade). Background elements are tertiary (subtle parallax, ambient glow).

## Component Selection

- **Components**: 
  - Card (product display with hover states, modified with glow border effects using box-shadow)
  - Button (CTAs with gold variant, loading states)
  - Dialog (cart drawer, product quick view)
  - Badge (product tags, "New" indicators with gold variant)
  - Tabs (product categories, game info sections)
  - Separator (section dividers with gold accent)
  - Skeleton (loading states matching card layout)
  - Input & Select (search and filters)
  - Drawer (mobile navigation, shopping cart)
- **Customizations**: 
  - GlowCard component extending Card with animated gold border glow
  - ProductCard with image zoom on hover and floating action buttons
  - HeroSection with parallax background and gradient overlays
  - CategoryFilter with active state gold underline animation
- **States**: 
  - Buttons: rest (solid), hover (glow + lift), active (pressed), loading (spinner)
  - Cards: rest (subtle shadow), hover (lift + glow + scale 1.02), active (border accent)
  - Inputs: rest (border), focus (gold ring + glow), filled (muted background), error (red accent)
- **Icon Selection**: 
  - ShoppingCart (cart actions)
  - Heart (favorites/wishlist)
  - MagnifyingGlass (search)
  - Funnel (filters)
  - GameController (game section)
  - Users (community)
  - Star (ratings/featured)
  - ArrowRight (navigation, CTAs)
- **Spacing**: 
  - Container max-width: 1280px with px-6 (mobile) / px-8 (desktop)
  - Section spacing: py-16 (mobile) / py-24 (desktop)
  - Card grid gap: gap-6 (mobile) / gap-8 (desktop)
  - Component internal padding: p-4 (small), p-6 (medium), p-8 (large)
- **Mobile**: 
  - Mobile-first grid: 1 column (mobile) → 2 columns (tablet) → 3-4 columns (desktop)
  - Navigation: Full nav bar collapses to hamburger menu below 768px
  - Hero section: Stack text over image with gradient overlay on mobile
  - Product cards: Full-width on mobile, maintain hover effects as tap interactions
  - Cart: Drawer from right side on all screen sizes for consistency
