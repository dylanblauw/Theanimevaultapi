The Anime Vault – Website

Welcome to The Anime Vault, an anime-themed eCommerce platform where users can explore, browse, and purchase anime-related products.
This repository contains the full frontend source code, now fully powered by Square Catalog API with Vercel serverless API routes and TailwindCSS.

Project Overview

The Anime Vault is a modern and responsive web store built with:

Vite + React (TypeScript) – for fast development and rendering

TailwindCSS – for styling and component consistency

Square Catalog API – for product catalog and pricing (via serverless routes)

Vercel – for production hosting and deployment

🛠️ Project Structure
. 
├── api/products/            # Square Catalog API endpoints (/api/products, /api/products/[id])
├── public/                   # Static assets (images, icons, etc.)
├── src/lib/square.ts        # Client service for Square-backed product fetching
├── src/                      # Main application source (React components, pages, etc.)
├── .env.example              # Example environment variables
├── LOCAL_SETUP.md            # Local development setup guide
├── .env.example              # Square environment variables template
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
Fill in your Square API credentials.

Run the development server

npm run dev


The project will start at http://localhost:5173 (by default).

Making Changes

Styling:
Modify src components and update styles using TailwindCSS classes in each .tsx file.
For global design rules, edit tailwind.config.js.

Square Integration:
Serverless API routes live in /api/products.
Client uses src/lib/square.ts to fetch products.

Products & Categories:
Categories and product data are fetched from Square Catalog API. The client applies local filters and sorting.

Environment Variables:
Add your Square credentials in .env (see .env.example). Never expose tokens in the browser.

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
Make sure API keys and Square credentials are never committed to the repository.

License

This project is licensed under the MIT License – see LICENSE
 for details.

Maintainer

Developer: @dylanblauw

Website: The Anime Vault

For any questions or contributions, please open an issue or create a pull request.
