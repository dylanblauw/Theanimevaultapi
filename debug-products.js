// Quick test to check our fallback products
import { products as fallbackProducts } from '../lib/products'

console.log('=== FALLBACK PRODUCTS DEBUG ===')
console.log('Total products:', fallbackProducts.length)

const categories = [...new Set(fallbackProducts.map(p => p.category))]
console.log('Available categories:', categories)

categories.forEach(cat => {
  const count = fallbackProducts.filter(p => p.category === cat).length
  console.log(`${cat}: ${count} products`)
})

console.log('\nAll products:')
fallbackProducts.forEach(p => {
  console.log(`- ${p.name} (${p.category})`)
})