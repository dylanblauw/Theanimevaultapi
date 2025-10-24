# WooCommerce Integration Guide

## 📋 Setup Instructies

### 1. Environment Variables Instellen

Er zijn twee scenario’s: lokaal ontwikkelen (Vite dev server) en productie op Vercel. In beide gevallen worden je secrets NIET naar de browser gestuurd.

• Lokaal (Vite dev proxy gebruikt server-side env):
1) Kopieer `.env.example` naar `.env`
2) Vul deze waarden in:
```
WOOCOMMERCE_URL=https://jouw-webshop.com
WOOCOMMERCE_CONSUMER_KEY=<ck_...>
WOOCOMMERCE_CONSUMER_SECRET=<cs_...>
```

• Productie (Vercel serverless proxy op /api/wc):
Voeg in Vercel Project Settings → Environment Variables toe:
```
NEXT_PUBLIC_WC_URL=https://jouw-webshop.com
WOOCOMMERCE_CONSUMER_KEY=<ck_...>
WOOCOMMERCE_CONSUMER_SECRET=<cs_...>
```
De frontend blijft altijd praten met `/api/wc`, dus er is geen code-aanpassing nodig tussen dev en prod.

### 2. WooCommerce Store URL
Vul je echte store URL in bij `WOOCOMMERCE_URL` (lokaal) en `NEXT_PUBLIC_WC_URL` (Vercel).

### 3. Test de Verbinding
1. Start de development server: `npm run dev`
2. Ga naar de "WooCommerce Test" pagina in de navigatie
3. Klik op "Test Verbinding" om te controleren of alles werkt

## 🛡️ Security

### API Keys Beveiliging:
- ✅ Secrets leven alleen server-side (dev: Vite proxy, prod: Vercel function)
- ✅ `.env` staat in `.gitignore` en komt niet in Git
- ✅ `.env.example` bevat enkel placeholders
- 🚫 Geen keys met `VITE_` prefix gebruiken in productie; die zouden client-side zichtbaar zijn

### Aanbevelingen:
1. Gebruik aparte READ-only keys voor development en productie
2. Beperk permissies (bij voorkeur alleen Read voor publieke shopdata)
3. Voor niet-same-origin scenario’s: CORS correct instellen (niet nodig wanneer frontend → eigen `/api/wc` proxy gaat)

## 📦 Beschikbare Functies

### WooCommerce Service (`src/lib/woocommerce.ts`)
```typescript
// Alle producten ophalen
const { data: products } = await wooCommerceService.getProducts({
  per_page: 20,
  featured: true
})

// Zoeken in producten
const results = await wooCommerceService.searchProducts('anime')

// Producten per categorie
const categoryProducts = await wooCommerceService.getProductsByCategory(123)

// Categorieën ophalen
const { data: categories } = await wooCommerceService.getCategories()
```

Onder water spreekt de service altijd met `/api/wc/...`:
- Dev: Vite dev server proxyt `'/api/wc' -> '{WOOCOMMERCE_URL}/wp-json/wc/v3'` met Basic Auth
- Prod (Vercel): Serverless function in `api/wc/[...path].ts` doet dezelfde proxy met je Vercel env vars

### Product Data Conversie
```typescript
// WooCommerce product naar lokaal formaat
const localProduct = convertWooCommerceProduct(wooCommerceProduct)
```

## 🎯 Volgende Stappen

1. **Store URL instellen** in `.env` file
2. **API verbinding testen** via test pagina
3. **Producten bekijken** en categorieën verkennen
4. **Shop pagina integreren** met echte WooCommerce data
5. **Winkelwagen functionaliteit** koppelen aan WooCommerce orders

## 🔧 Troubleshooting

### Veelvoorkomende Problemen:

**CORS Errors:**
- Gebruik de ingebouwde proxy (`/api/wc`); dan is er doorgaans geen CORS nodig
- Alleen als je rechtstreeks naar de store zou callen is CORS relevant

**Authentication Failed:**
- Controleer Consumer Key en Secret
- Check API permissions in WooCommerce settings
- Verify SSL settings (HTTPS required voor productie)

**No Products Found:**
- Check of je store producten heeft
- Verify product visibility settings
- Test met verschillende API parameters

### Debug Mode:
Open browser developer tools en check Console/Network tabs voor API call details.

## 📚 Documentatie Links

- [WooCommerce REST API Docs](https://woocommerce.github.io/woocommerce-rest-api-docs/)
- [WooCommerce REST API NPM Package](https://www.npmjs.com/package/@woocommerce/woocommerce-rest-api)