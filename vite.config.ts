// @ts-nocheck
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, PluginOption, loadEnv } from "vite";

import sparkPlugin from "@github/spark/spark-vite-plugin";
import createIconImportProxy from "@github/spark/vitePhosphorIconProxyPlugin";
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Buffer } from 'node:buffer'

const projectRoot = process?.env?.PROJECT_ROOT || fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, projectRoot, "");

  const WC_URL = env.WOOCOMMERCE_URL || env.VITE_WOOCOMMERCE_URL || "";
  const WC_CK = env.WOOCOMMERCE_CONSUMER_KEY || env.VITE_WOOCOMMERCE_CONSUMER_KEY || "";
  const WC_CS = env.WOOCOMMERCE_CONSUMER_SECRET || env.VITE_WOOCOMMERCE_CONSUMER_SECRET || "";

  // Build Basic Auth header value once for proxy
  const basicAuth = Buffer.from(`${WC_CK}:${WC_CS}`).toString('base64');

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
      proxy: WC_URL
        ? {
            // Proxy WooCommerce REST API securely in dev:
            // Frontend calls /api/wc/* -> proxied to {WC_URL}/wp-json/wc/v3/* with Basic Auth
            "/api/wc": {
              target: WC_URL,
              changeOrigin: true,
              secure: true,
              rewrite: (path) => path.replace(/^\/api\/wc/, "/wp-json/wc/v3"),
              configure: (proxy) => {
                proxy.on('proxyReq', (proxyReq) => {
                  if (WC_CK && WC_CS) {
                    proxyReq.setHeader('Authorization', `Basic ${basicAuth}`);
                  }
                  proxyReq.setHeader('Accept', 'application/json');
                });
              },
            },
          }
        : undefined,
    },
  };
});
