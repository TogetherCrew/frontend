// import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

// if (process.env.NODE_ENV === 'development') {
//   setupDevPlatform(nextConfig);
// }

// export default nextConfig;

// module.exports = nextConfig;

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })

// const nextConfig = withBundleAnalyzer({
//   // distDir: 'out',
//   output: 'export',
//   reactStrictMode: false,
//   swcMinify: true,
//   trailingSlash: true,
//   images: {
//     unoptimized: true,
//   },
// })

module.exports = nextConfig;