/** @type {import('next').NextConfig} */

const nextConfig = {
  // output: 'export',
  distDir: 'out',
  reactStrictMode: false,
  swcMinify: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
