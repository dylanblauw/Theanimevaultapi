// @ts-nocheck
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, PluginOption, loadEnv } from "vite";

import sparkPlugin from "@github/spark/spark-vite-plugin";
import createIconImportProxy from "@github/spark/vitePhosphorIconProxyPlugin";
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = process?.env?.PROJECT_ROOT || fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, projectRoot, "");

  const PRINTIFY_API_TOKEN = env.WOOCOMMERCE_CONSUMER_KEY || env.VITE_WOOCOMMERCE_CONSUMER_KEY || "";
  const SHOP_ID = env.WOOCOMMERCE_URL || env.VITE_WOOCOMMERCE_URL || "";

  return {
    plugins: [
      react(),
      tailwindcss(),
      // DO NOT REMOVE
      createIconImportProxy() as PluginOption,
      sparkPlugin() as PluginOption,
    ],
    resolve: {
      alias: {
        '@': resolve(projectRoot, 'src')
      }
    },
    server: {
      proxy: PRINTIFY_API_TOKEN
        ? {
            // Proxy Printify REST API securely in dev:
            // Frontend calls /api/wc/* -> proxied to https://api.printify.com/v1/* with Bearer Auth
            "/api/wc": {
              target: "https://api.printify.com/v1",
              changeOrigin: true,
              secure: true,
              rewrite: (path) => {
                const pathWithoutPrefix = path.replace(/^\/api\/wc/, "")
                // Map common paths to Printify equivalents
                if (pathWithoutPrefix.includes('products/categories')) {
                  // Return mock categories - this will be handled by the proxy handler
                  return pathWithoutPrefix
                } else if (pathWithoutPrefix === '/products' || pathWithoutPrefix.startsWith('/products/')) {
                  if (pathWithoutPrefix === '/products') {
                    return `/shops/${SHOP_ID}/products.json`
                  } else {
                    const productId = pathWithoutPrefix.replace('/products/', '')
                    return `/shops/${SHOP_ID}/products/${productId}.json`
                  }
                }
                return pathWithoutPrefix
              },
              configure: (proxy) => {
                proxy.on('proxyReq', (proxyReq) => {
                  if (PRINTIFY_API_TOKEN) {
                    proxyReq.setHeader('Authorization', `Bearer ${PRINTIFY_API_TOKEN}`);
                  }
                  proxyReq.setHeader('Accept', 'application/json');
                  proxyReq.setHeader('Content-Type', 'application/json');
                });
              },
            },
          }
        : undefined,
    },
  };
});
