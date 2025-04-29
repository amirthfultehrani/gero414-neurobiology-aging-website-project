// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite"; // <-- Keep this import for the Vite plugin

// --- GitHub Pages Project Site Configuration ---
// Replace with your actual GitHub username and repository name
const GITHUB_USERNAME = 'amirthfultehrani';
const GITHUB_REPO_NAME = 'gero414-neurobiology-aging-website-project';
// ----------------------------------------------

// https://astro.build/config
export default defineConfig({
  // Configure Astro's output for a static site (correct for GitHub Pages)
  output: 'static',

  // Configure the base URL and path for GitHub Pages project sites
  // IMPORTANT: Make sure these match your GitHub setup exactly!
  site: `https://${GITHUB_USERNAME}.github.io`, // Your base domain
  base: `/${GITHUB_REPO_NAME}`, // The subpath for your repository

  // --- Keep the Vite config section for Tailwind v4 ---
  vite: {
    plugins: [
      tailwindcss() // Tell Vite to use the Tailwind plugin
    ],
  },

  // Optional: Configure trailing slashes if desired (defaults to 'ignore')
  // trailingSlash: 'always', // Example: require trailing slashes on all URLs
});