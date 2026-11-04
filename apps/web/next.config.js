/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@sabo-mutu/core'],
  experimental: {
    optimizePackageImports: ['@sabo-mutu/core'],
  },
}

module.exports = nextConfig