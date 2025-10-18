# 🛒 WooCommerce API Integratie - Complete Handleiding

## 📋 **Setup Stappen**

### **Stap 1: Je WooCommerce URL instellen**
1. Open het `.env` bestand
2. Vervang `https://your-woocommerce-site.com` door je echte website URL
3. Bijvoorbeeld: `VITE_WOOCOMMERCE_URL=https://jouw-anime-shop.com`

### **Stap 2: API Verbinding testen**
1. Ga naar je website: `http://localhost:5000`
2. Klik op "API Test" in de navigatie
3. Klik op "Test Verbinding"
4. Als het werkt zie je: ✅ "Verbinding succesvol!"

### **Stap 3: WooCommerce Shop activeren**
De nieuwe shop is al geactiveerd via `VITE_USE_WOOCOMMERCE_SHOP=true` in je `.env` file.

## 🔧 **Hoe de API werkt**

### **Beschikbare Functies**

```typescript
import { wooCommerceService } from '@/lib/woocommerce'

// 1. Alle producten ophalen
const { data: products, total } = await wooCommerceService.getProducts({
  per_page: 12,        // Aantal producten per pagina
  page: 1,             // Pagina nummer
  featured: true,      // Alleen featured producten
  on_sale: true,       // Alleen sale producten
  orderby: 'date',     // Sorteren op: date, price, popularity, rating
  order: 'desc'        // Volgorde: asc, desc
})

// 2. Zoeken in producten
const results = await wooCommerceService.searchProducts('naruto')

// 3. Producten per categorie
const categoryProducts = await wooCommerceService.getProductsByCategory(123)

// 4. Featured producten voor homepage
const featured = await wooCommerceService.getFeaturedProducts(6)

// 5. Categorieën ophalen
const { data: categories } = await wooCommerceService.getCategories()
```

### **Product Data Structuur**

WooCommerce producten worden automatisch geconverteerd naar je lokale formaat:

```typescript
// WooCommerce Product wordt omgezet naar:
interface Product {
  id: string
  name: string
  price: number
  originalPrice: number
  image: string
  category: string
  inStock: boolean
  featured: boolean
  description: string
  shortDescription: string
  tags: string[]
  images: string[]
  sku: string
  rating: number
  onSale: boolean
  stockQuantity: number
}
```

## 🎯 **Wat je nu kunt doen**

### **1. Test je API Verbinding**
- Ga naar "API Test" pagina
- Test de verbinding met je WooCommerce store
- Bekijk je producten en categorieën

### **2. Bekijk je Echte Shop**
- Ga naar "Shop" pagina
- Je ziet nu je echte WooCommerce producten
- Zoeken en filteren werkt met echte data

### **3. Configureer je Producten**
In je WooCommerce admin panel kun je:
- Producten als "Featured" markeren (verschijnen op homepage)
- Categorieën aanmaken en toewijzen
- Prijzen en sale prijzen instellen
- Product afbeeldingen uploaden
- Voorraad beheren

## 📊 **Shop Functies**

### **Zoeken & Filteren**
- ✅ Zoeken op productnaam en beschrijving
- ✅ Filteren op categorieën
- ✅ Paginering voor grote aantallen producten
- ✅ Sorteer opties (datum, prijs, populariteit)

### **Product Weergave**
- ✅ Product afbeeldingen
- ✅ Prijzen (normaal + sale)
- ✅ Voorraad status
- ✅ Categorieën als tags
- ✅ Hover effecten en animaties

### **Performance**
- ✅ Lazy loading van producten
- ✅ Error handling bij API problemen
- ✅ Loading states
- ✅ Responsive design

## 🔄 **Schakelen tussen Old/New Shop**

In je `.env` file:
```bash
# Nieuwe WooCommerce shop gebruiken
VITE_USE_WOOCOMMERCE_SHOP=true

# Oude statische shop gebruiken
VITE_USE_WOOCOMMERCE_SHOP=false
```

## 🚨 **Troubleshooting**

### **Veelvoorkomende Problemen:**

**1. "Connection Failed"**
- Check je `VITE_WOOCOMMERCE_URL` in `.env`
- Zorg dat je website bereikbaar is
- Controleer SSL certificaat (HTTPS required)

**2. "Authentication Failed"**
- Verify je Consumer Key en Secret
- Check API permissions in WooCommerce settings

**3. "No Products Found"**
- Check of je WooCommerce store producten heeft
- Verify product visibility settings
- Test met verschillende categorieën

**4. CORS Errors**
- Voeg je development URL toe aan WooCommerce CORS settings
- Install een CORS plugin in WordPress

### **Debug Tips:**
1. Open browser F12 → Console tab voor JavaScript errors
2. Check Network tab voor API call details
3. Use "API Test" pagina voor verbinding diagnosis

## 📈 **Next Steps**

1. **Vul je echte WooCommerce URL in**
2. **Test de API verbinding**
3. **Configure je producten in WooCommerce admin**
4. **Test de nieuwe shop functionaliteit**
5. **Customize de styling naar wens**

## 🎨 **Styling Aanpassingen**

Je kunt de shop styling aanpassen in:
- `src/components/pages/WooCommerceShopPage.tsx` - Shop layout
- `src/components/ProductCard.tsx` - Product card styling
- `src/styles/gradients.css` - Gradient effecten

De nieuwe shop gebruikt dezelfde styling als de rest van je website (goud-blauw thema, animaties, etc.)!