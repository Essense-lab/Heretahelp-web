/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure remote image domains used across the app
  images: {
    domains: [
      'localhost',
      'supabase.co',
      'your-supabase-project.supabase.co', // Replace with your actual Supabase project URL
      'apzjsehgjyimkkcuinlv.supabase.co',
      'images.unsplash.com',
    ],
  },
  // Increase bundle size limits to handle large data structures
  experimental: {
    webpackBuildWorker: false, // Disable webpack build worker to avoid memory issues
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Increase memory limit for webpack
    config.performance = {
      hints: false, // Disable performance hints
      maxAssetSize: 10000000, // 10MB
      maxEntrypointSize: 10000000, // 10MB
    }

    // Increase Node.js memory limit
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }

    return config
  },
  // Increase Node.js memory limit for build
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
  },
}

module.exports = nextConfig
