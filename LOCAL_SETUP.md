# Local Development Setup

## Square API Configuratie

Voor lokale development heb je Square API credentials nodig. Volg deze stappen:

### 1. Kopieer het example bestand:
```bash
cp .env.example .env.local
```

### 2. Vul je Square credentials in:
```bash
# In .env.local
SQUARE_ACCESS_TOKEN=...
SQUARE_APPLICATION_ID=...
SQUARE_LOCATION_ID=...
SQUARE_ENV=sandbox
```

### 3. Square credentials vinden:
1. Ga naar Square Developer Dashboard → Apps → Kies je app
2. Ga naar Credentials en kopieer je Access Token en Application ID
3. Haal je Location ID op via het Square dashboard (Locations)

### 4. Restart de dev server:
```bash
npm run dev
```

## Fallback Mode

Zonder API credentials werkt de app in fallback mode met demo-producten uit `src/lib/products.ts`.