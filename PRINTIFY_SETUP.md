# Printify API Setup Guide

Deze applicatie is gemigreerd van WooCommerce naar Printify, maar gebruikt nog steeds dezelfde environment variable namen voor compatibility.

## Environment Variables Setup

Je hebt deze environment variables nodig:

```bash
# Server-side (voor Vercel deployment)
WOOCOMMERCE_CONSUMER_KEY=your_printify_api_token_here
WOOCOMMERCE_URL=your_shop_id_here

# Client-side (voor development)
VITE_WOOCOMMERCE_CONSUMER_KEY=your_printify_api_token_here
VITE_WOOCOMMERCE_URL=your_shop_id_here
NEXT_PUBLIC_WC_URL=your_shop_id_here
```

**Belangrijk**: Ondanks de "WOOCOMMERCE" namen bevatten deze nu Printify credentials:
- `WOOCOMMERCE_CONSUMER_KEY` = Jouw **Printify API Token**
- `WOOCOMMERCE_URL` = Jouw **Printify Shop ID** (alleen het nummer)

## Stap 1: Printify API Token verkrijgen

1. Log in op [Printify Dashboard](https://printify.com/app/dashboard)
2. Ga naar **My Apps** in het linkermenu
3. Klik op **Create/Manage API Tokens**
4. Genereer een nieuwe API token met de juiste permissions:
   - `shops:read`
   - `products:read`
   - `orders:read` (indien nodig)
5. Kopieer de gegenereerde API token

## Stap 2: Shop ID vinden

1. In je Printify Dashboard, ga naar **My Stores**
2. Selecteer de store die je wilt gebruiken
3. Kijk in de URL naar het Shop ID nummer, bijvoorbeeld:
   `https://printify.com/app/stores/12345/...` → Shop ID is `12345`
4. Of ga naar Store Settings en vind het Shop ID daar

## Stap 3: Environment Variables instellen

### Voor Local Development:
1. Kopieer `.env.example` naar `.env`
2. Vul je credentials in:
```bash
WOOCOMMERCE_CONSUMER_KEY=ptfy_xxxxxxxxxxxxx
WOOCOMMERCE_URL=12345
VITE_WOOCOMMERCE_CONSUMER_KEY=ptfy_xxxxxxxxxxxxx
VITE_WOOCOMMERCE_URL=12345
NEXT_PUBLIC_WC_URL=12345
```

### Voor Vercel Deployment:
1. Ga naar je Vercel project dashboard
2. Ga naar **Settings** → **Environment Variables**
3. Voeg toe:
   - `WOOCOMMERCE_CONSUMER_KEY` = `ptfy_xxxxxxxxxxxxx`
   - `WOOCOMMERCE_URL` = `12345`
   - `VITE_WOOCOMMERCE_CONSUMER_KEY` = `ptfy_xxxxxxxxxxxxx`
   - `VITE_WOOCOMMERCE_URL` = `12345`
   - `NEXT_PUBLIC_WC_URL` = `12345`

## API Endpoints

De applicatie maakt nu gebruik van deze Printify endpoints:

- **Products**: `GET /shops/{SHOP_ID}/products.json`
- **Single Product**: `GET /shops/{SHOP_ID}/products/{PRODUCT_ID}.json`
- **Orders**: `GET /shops/{SHOP_ID}/orders.json` (indien gebruikt)

## Development

Start de development server:
```bash
npm run dev
```

De app draait op `http://localhost:5000`

## Deployment

Build voor productie:
```bash
npm run build
```

Deploy naar Vercel:
```bash
vercel --prod
```

## Troubleshooting

### API Connection Failed
- Controleer of je API token correct is
- Controleer of je Shop ID klopt
- Zorg ervoor dat je API token de juiste permissions heeft

### No Products Loading
- Controleer of je shop products heeft in Printify
- Test de API connection in de browser developer tools
- Controleer of de proxy correct werkt (`/api/wc/products`)

### Environment Variables Not Working
- Herstart de development server na wijzigingen aan `.env`
- Controleer of je `.env` file in de root directory staat
- Op Vercel: controleer of alle environment variables correct ingesteld zijn

## Migration Notes

- Alle `WooCommerceProduct` types zijn vervangen door `PrintifyProduct`
- Authentication is veranderd van Basic Auth naar Bearer token
- Endpoints zijn gemigreerd van `/wp-json/wc/v3/*` naar Printify API
- Product categories worden nu gesimuleerd via tags
- Pricing wordt geconverteerd van cents naar euros (Printify gebruikt cents)

## Support

Voor Printify API documentatie: [https://developers.printify.com/](https://developers.printify.com/)