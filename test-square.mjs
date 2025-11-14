// Quick test to verify Square API credentials
import dotenv from 'dotenv'
dotenv.config()

const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN

console.log('🧪 Testing Square API Connection...')
console.log(`🔑 Access Token: ${SQUARE_ACCESS_TOKEN ? SQUARE_ACCESS_TOKEN.substring(0, 20) + '...' : 'MISSING'}`)

if (!SQUARE_ACCESS_TOKEN) {
  console.error('❌ No access token found!')
  process.exit(1)
}

async function testSquareAPI() {
  try {
    console.log('\n📡 Making request to Square Catalog API...')
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    const response = await fetch('https://connect.squareup.com/v2/catalog/list?limit=1', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Square-Version': '2023-12-13'
      },
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    console.log(`\n✅ Response Status: ${response.status} ${response.statusText}`)
    
    const data = await response.json()
    
    if (!response.ok) {
      console.error('\n❌ Square API Error:')
      console.error(JSON.stringify(data, null, 2))
      process.exit(1)
    }
    
    console.log('\n✨ Success! Square API is working')
    console.log(`📦 Objects received: ${data.objects?.length || 0}`)
    
    if (data.objects && data.objects.length > 0) {
      console.log('\n📋 First object:')
      console.log(`   Type: ${data.objects[0].type}`)
      console.log(`   ID: ${data.objects[0].id}`)
      if (data.objects[0].type === 'ITEM') {
        console.log(`   Name: ${data.objects[0].item_data?.name || 'N/A'}`)
      }
    }
    
    console.log('\n✅ Square integration is correctly configured!')
    
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('\n❌ Request timed out after 10 seconds')
      console.error('   This might indicate network issues or firewall blocking')
    } else {
      console.error('\n❌ Error testing Square API:')
      console.error(error.message)
    }
    process.exit(1)
  }
}

testSquareAPI()
