/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing config
  experimental: {
    // Your existing experimental options
    runtime: 'edge',
    // This forces all pages to use the edge runtime
    appDir: true,
  },
};

module.exports = nextConfig;