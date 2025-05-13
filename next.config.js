/** @type {import('next').NextConfig} */

const nextConfig = {
  // output: 'export',
  reactStrictMode: false,
  swcMinify: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  distDir: 'out',
};

module.exports = nextConfig;
