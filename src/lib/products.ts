import { Product } from './types'

export const products: Product[] = [
  {
    id: '1',
    name: 'Demon Slayer Nichirin Blade Replica',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&q=80',
    category: 'Collectibles',
    description: 'Premium replica of Tanjiro\'s iconic sword. Hand-painted with authentic details and display stand included.',
    rating: 4.8,
    inStock: true,
    featured: true
  },
  {
    id: '2',
    name: 'Attack on Titan Survey Corps Jacket',
    price: 124.99,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    category: 'Apparel',
    description: 'Official Survey Corps uniform jacket. High-quality embroidered patches and comfortable fit.',
    rating: 4.9,
    inStock: true,
    featured: true
  },
  {
    id: '3',
    name: 'Naruto Hidden Leaf Headband',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=800&q=80',
    category: 'Accessories',
    description: 'Authentic Hidden Leaf Village headband with metal plate and adjustable cloth strap.',
    rating: 4.7,
    inStock: true
  },
  {
    id: '4',
    name: 'One Piece Straw Hat Crew Poster Set',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80',
    category: 'Art',
    description: 'Set of 9 premium art posters featuring each Straw Hat crew member. Museum-quality print.',
    rating: 4.6,
    inStock: true,
    featured: true
  },
  {
    id: '5',
    name: 'My Hero Academia All Might Figure',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=800&q=80',
    category: 'Collectibles',
    description: '12-inch premium figure of All Might in his iconic hero pose. Limited edition with certificate.',
    rating: 5.0,
    inStock: true,
    featured: true
  },
  {
    id: '6',
    name: 'Jujutsu Kaisen Cursed Energy T-Shirt',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
    category: 'Apparel',
    description: 'Premium cotton tee with glow-in-the-dark cursed energy design. Officially licensed.',
    rating: 4.5,
    inStock: true
  },
  {
    id: '7',
    name: 'Fullmetal Alchemist Pocket Watch',
    price: 64.99,
    image: 'https://images.unsplash.com/photo-1509941943102-10c232535736?w=800&q=80',
    category: 'Accessories',
    description: 'State Alchemist pocket watch replica with chain. Functional timepiece with detailed engraving.',
    rating: 4.8,
    inStock: false
  },
  {
    id: '8',
    name: 'Tokyo Ghoul Kaneki Mask',
    price: 44.99,
    image: 'https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=800&q=80',
    category: 'Collectibles',
    description: 'High-quality replica of Kaneki\'s iconic mask. Adjustable straps and durable construction.',
    rating: 4.7,
    inStock: true
  },
  {
    id: '9',
    name: 'Spirited Away Bath House Art Print',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=800&q=80',
    category: 'Art',
    description: 'Limited edition art print of the iconic bathhouse scene. Signed by artist.',
    rating: 4.9,
    inStock: true
  },
  {
    id: '10',
    name: 'Dragon Ball Z Saiyan Armor Hoodie',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
    category: 'Apparel',
    description: 'Premium hoodie designed to look like Saiyan battle armor. Comfortable and stylish.',
    rating: 4.6,
    inStock: true
  },
  {
    id: '11',
    name: 'Death Note Replica Journal',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
    category: 'Collectibles',
    description: 'High-quality replica of the Death Note with authentic styling. Perfect for collectors.',
    rating: 4.8,
    inStock: true,
    featured: true
  },
  {
    id: '12',
    name: 'Cowboy Bebop Swordfish Poster',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80',
    category: 'Art',
    description: 'Vintage-style poster featuring the Swordfish II spacecraft. Premium matte finish.',
    rating: 4.7,
    inStock: true
  }
]

export const categories = ['All', 'Collectibles', 'Apparel', 'Accessories', 'Art']
