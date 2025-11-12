The Anime Vault – Website

Welcome to The Anime Vault, an anime-themed eCommerce platform where users can explore, browse, and purchase anime-related products.
This repository contains the full frontend source code, including integrations with WooCommerce, Vercel, and TailwindCSS.

Project Overview

The Anime Vault is a modern and responsive web store built with:

Vite + React (TypeScript) – for fast development and rendering

TailwindCSS – for styling and component consistency

WooCommerce REST API – for product management and dynamic data

Vercel – for production hosting and deployment

🛠️ Project Structure
.
├── api/wc/                   # WooCommerce API integration
├── public/                   # Static assets (images, icons, etc.)
├── scripts/woo/              # Custom scripts for WooCommerce synchronization
├── src/                      # Main application source (React components, pages, etc.)
├── .env.example              # Example environment variables
├── LOCAL_SETUP.md            # Local development setup guide
├── WOOCOMMERCE_GUIDE.md      # How to connect and manage WooCommerce
├── WOOCOMMERCE_SETUP.md      # WooCommerce environment configuration
├── vite.config.ts            # Vite build configuration
├── tailwind.config.js        # TailwindCSS configuration
└── package.json              # Dependencies and project scripts

Installation & Local Setup

Clone the repository

git clone https://github.com/dylanblauw/the-anime-vault.git
cd the-anime-vault


Install dependencies

npm install


Create your .env file
Copy .env.example and rename it to .env.
Fill in your API keys and WooCommerce credentials.

Run the development server

npm run dev


The project will start at http://localhost:5173 (by default).

Making Changes

Styling:
Modify src components and update styles using TailwindCSS classes in each .tsx file.
For global design rules, edit tailwind.config.js.

WooCommerce Integration:
Configuration and sync scripts are under /api/wc and /scripts/woo.
See WOOCOMMERCE_GUIDE.md for detailed connection instructions.

Products & Categories:
Categories and product data are dynamically fetched from WooCommerce.
You can modify label formats or visibility in src/components/shop/.

Environment Variables:
Adjust API URLs or tokens in .env.

Deployment:
The project is optimized for Vercel.
Simply connect this repository to your Vercel account, and it will auto-deploy on every push to main.

Scripts
Command	Description
npm run dev	Start development server
npm run build	Build production version
npm run preview	Preview production build locally
Security

For security details, please read SECURITY.md
.
Make sure API keys and WooCommerce credentials are never committed to the repository.

License

This project is licensed under the MIT License – see LICENSE
 for details.

Maintainer

Developer: @dylanblauw

Website: The Anime Vault

For any questions or contributions, please open an issue or create a pull request.
