// Test Printify API connection and discover Shop ID

// Read environment variables
const envVars = ((import.meta as any).env || {}) as Record<string, string | undefined>
function getEnvVar(...keys: string[]) {
  for (const k of keys) {
    const v = envVars[k]
    if (typeof v === 'string' && v.length > 0) return v
  }
  return ''
}

const PRINTIFY_API_TOKEN = getEnvVar(
  'VITE_WOOCOMMERCE_CONSUMER_KEY',
  'NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY',
  'NEXT_PUBLIC_WC_CK',
  'NEXT_PUBLIC_WC_KEY'
)

async function discoverShops() {
  console.log('=== DISCOVERING PRINTIFY SHOPS ===')
  
  if (!PRINTIFY_API_TOKEN) {
    console.error('❌ No API token found')
    return null
  }

  console.log('Using API token:', PRINTIFY_API_TOKEN.substring(0, 10) + '...')

  try {
    const response = await fetch('https://api.printify.com/v1/shops.json', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PRINTIFY_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      console.error('❌ API call failed:', response.status, response.statusText)
      const errorText = await response.text()
      console.error('Error details:', errorText)
      return null
    }

    const shops = await response.json()
    console.log('✅ Shops discovered:', shops)

    if (shops.length > 0) {
      const firstShop = shops[0]
      console.log('🎯 Your Shop ID is:', firstShop.id)
      console.log('Shop name:', firstShop.title)
      console.log('')
      console.log('UPDATE YOUR ENVIRONMENT VARIABLES WITH:')
      console.log('VITE_WOOCOMMERCE_URL=' + firstShop.id)
      console.log('NEXT_PUBLIC_WC_URL=' + firstShop.id)
      console.log('WOOCOMMERCE_URL=' + firstShop.id)
      return firstShop.id
    } else {
      console.warn('⚠️ No shops found')
      return null
    }
  } catch (error: any) {
    console.error('❌ Error discovering shops:', error.message)
    return null
  }
}

export async function testPrintifyConnection() {
  console.log('=== TESTING PRINTIFY API CONNECTION ===')
  
  // First discover shops
  const shopId = await discoverShops()
  
  if (!shopId) {
    console.error('❌ Cannot test connection without Shop ID')
    return false
  }

  // Now test with the discovered shop ID
  try {
    const response = await fetch(`https://api.printify.com/v1/shops/${shopId}/products.json`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PRINTIFY_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      console.error('❌ Products API call failed:', response.status, response.statusText)
      return false
    }

    const products = await response.json()
    console.log('✅ Products API works! Found', products.data?.length || 0, 'products')
    
    if (products.data && products.data.length > 0) {
      console.log('First product:', products.data[0].title)
    }
    
    return true
  } catch (error: any) {
    console.error('❌ Products test failed:', error.message)
    return false
  }
}

// Auto-run test when this module is imported in development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  setTimeout(() => {
    testPrintifyConnection()
  }, 2000)
}