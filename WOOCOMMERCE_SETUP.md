# WooCommerce Integration Guide

## 📋 Setup Instructies

### 1. Environment Variables Instellen
1. Kopieer `.env.example` naar `.env`
2. Vul je WooCommerce gegevens in:
   ```
   VITE_WOOCOMMERCE_CONSUMER_KEY=ck_aa109cf58a0f5e68cce0566dd5583e8c5acfb119
   VITE_WOOCOMMERCE_CONSUMER_SECRET=cs_4bfd39d74df661f279a2fc7976a5082e3f7d8f1a
   VITE_WOOCOMMERCE_URL=https://jouw-webshop.com
   ```

### 2. WooCommerce Store URL
Je moet nog de juiste URL van je WooCommerce store invullen in de `.env` file bij `VITE_WOOCOMMERCE_URL`.

### 3. Test de Verbinding
1. Start de development server: `npm run dev`
2. Ga naar de "WooCommerce Test" pagina in de navigatie
3. Klik op "Test Verbinding" om te controleren of alles werkt

## 🛡️ Security

### API Keys Beveiliging:
- ✅ API keys staan in `.env` file (wordt niet gepusht naar Git)
- ✅ `.env` staat in `.gitignore`
- ✅ `.env.example` bevat alleen voorbeelden
- ⚠️ **Let op**: Vite `VITE_` prefix maakt variabelen zichtbaar in browser (voor frontend API calls)

### Aanbevelingen:
1. **Productie**: Gebruik aparte API keys voor development/productie
2. **Permissions**: Zet API key permissions zo laag mogelijk (alleen Read voor publieke data)
3. **CORS**: Configureer CORS instellingen in WooCommerce voor je domains

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
- Voeg je development URL toe aan WooCommerce CORS instellingen
- Check WordPress plugin voor CORS support

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