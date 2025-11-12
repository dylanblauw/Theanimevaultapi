// Debug environment variables
console.log('=== ENVIRONMENT VARIABLES DEBUG ===')

const envVars = ((import.meta as any).env || {}) as Record<string, string | undefined>

console.log('Available environment variables:')
console.log('VITE_WOOCOMMERCE_CONSUMER_KEY:', envVars.VITE_WOOCOMMERCE_CONSUMER_KEY ? envVars.VITE_WOOCOMMERCE_CONSUMER_KEY.substring(0, 10) + '... (length: ' + envVars.VITE_WOOCOMMERCE_CONSUMER_KEY.length + ')' : 'NOT SET')
console.log('VITE_WOOCOMMERCE_URL:', envVars.VITE_WOOCOMMERCE_URL || 'NOT SET')
console.log('NEXT_PUBLIC_WC_URL:', envVars.NEXT_PUBLIC_WC_URL || 'NOT SET')

console.log('')
console.log('Expected format:')
console.log('VITE_WOOCOMMERCE_CONSUMER_KEY=your_printify_api_token (should start with "ptfy_")')
console.log('VITE_WOOCOMMERCE_URL=your_shop_id (just a number like "12345")')
console.log('')

if (!envVars.VITE_WOOCOMMERCE_CONSUMER_KEY) {
  console.error('❌ Missing VITE_WOOCOMMERCE_CONSUMER_KEY - this should be your Printify API token')
}

if (!envVars.VITE_WOOCOMMERCE_URL) {
  console.error('❌ Missing VITE_WOOCOMMERCE_URL - this should be your Printify Shop ID')
}

if (envVars.VITE_WOOCOMMERCE_CONSUMER_KEY && envVars.VITE_WOOCOMMERCE_URL) {
  console.log('✅ Both credentials are set!')
  
  if (!envVars.VITE_WOOCOMMERCE_CONSUMER_KEY.startsWith('ptfy_')) {
    console.warn('⚠️  Warning: API token does not start with "ptfy_" - is this a valid Printify token?')
  }
  
  if (isNaN(Number(envVars.VITE_WOOCOMMERCE_URL))) {
    console.warn('⚠️  Warning: Shop ID is not a number - should be something like "12345"')
  }
}