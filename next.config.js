/** @type {import('next').NextConfig} */

const nextConfig = {
  // distDir: 'out',
  reactStrictMode: false,
  swcMinify: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
