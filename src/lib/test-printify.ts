// Test Printify API connection
import { printifyService } from './printify'

export async function testPrintifyConnection() {
  console.log('=== TESTING PRINTIFY API CONNECTION ===')
  
  try {
    const result = await printifyService.testConnection()
    console.log('Test result:', result)
    
    if (result.success) {
      console.log('✅ Printify API connection successful!')
      
      // Try to fetch products
      console.log('Fetching products...')
      const products = await printifyService.getProducts({ per_page: 5 })
      console.log('Products received:', products.data.length)
      console.log('First product:', products.data[0])
      
      return true
    } else {
      console.error('❌ Printify API connection failed:', result.error)
      return false
    }
  } catch (error: any) {
    console.error('❌ Test failed with error:', error.message)
    console.error('Full error:', error)
    return false
  }
}

// Auto-run test when this module is imported in development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  setTimeout(() => {
    testPrintifyConnection()
  }, 1000)
}