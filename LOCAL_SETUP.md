# Local Development Setup

## WooCommerce API Configuration

Voor lokale development heb je WooCommerce API credentials nodig. Volg deze stappen:

### 1. Kopieer het example bestand:
```bash
cp .env.example .env.local
```

### 2. Vul je WooCommerce credentials in:
```bash
# In .env.local
WOOCOMMERCE_URL=https://jouw-woocommerce-site.com
WOOCOMMERCE_CONSUMER_KEY=jouw_consumer_key
WOOCOMMERCE_CONSUMER_SECRET=jouw_consumer_secret
```

### 3. WooCommerce API Key aanmaken:
1. Ga naar WordPress Admin → WooCommerce → Settings → Advanced → REST API
2. Maak een nieuwe API key aan (Read-only is voldoende voor de shop)
3. Kopieer de Consumer Key en Consumer Secret naar je .env.local

### 4. Restart de dev server:
```bash
npm run dev
```

## Fallback Mode

Zonder API credentials werkt de app in fallback mode met:
- Demo categorieën (Gaming, Apparel, etc.)
- Beperkte functionaliteit voor product filtering

Voor volledige functionaliteit zijn echte WooCommerce credentials vereist.