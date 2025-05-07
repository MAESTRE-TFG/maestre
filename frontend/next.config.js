const createNextIntlPlugin = require('next-intl/plugin');
 
const withNextIntl = createNextIntlPlugin();
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['ui.aceternity.com'],
    unoptimized: true
  },
  // Add this to ensure static files are properly handled
  assetPrefix: process.env.NODE_ENV === 'production' ? '/' : '',
  // This tells Next.js to treat the /static folder as a public directory
  // which will be accessible at the root URL
  publicRuntimeConfig: {
    staticFolder: '/static',
  }
};
 
module.exports = withNextIntl(nextConfig);