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

  // Square envs (used by serverless API routes only; never exposed client-side)
  const SQUARE_ACCESS_TOKEN = env.SQUARE_ACCESS_TOKEN || "";

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
      // Proxy API requests to local dev server during development
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        }
      },
    },
  };
});
