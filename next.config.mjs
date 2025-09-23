// File: next.config.mjs
// Best practices: This is the single source of truth for your Next.js configuration,
// combining your project's settings with PWA capabilities.

// Import the withPWA function to add PWA capabilities.
import withPWA from 'next-pwa';

// Define PWA-specific settings.
const pwaConfig = withPWA({
  dest: 'public', // Destination directory for the service worker and related files.
  register: true, // Automatically register the service worker on the client side.
  skipWaiting: true, // Forces the waiting service worker to become the active service worker.
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development to avoid caching issues.
  runtimeCaching: [
    // You can add runtime caching strategies here for dynamic content or APIs.
  ],
});

/** @type {import('next').NextConfig} */
// This is your original configuration from the next.config.ts file.
const isImageOptimizationOn = process.env.IMAGE_OPTIMIZATION_ON === 'true';
const nextConfig = {
  experimental: {
    ppr: true, // Enables Partial Prerendering (PPR).
  },
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh', // Allows images from this hostname.
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
    //unoptimized: !isImageOptimizationOn,
  },
};

// Export the final, merged configuration.
// The `pwaConfig` function wraps your `nextConfig` and returns a new object
// with all settings combined.
export default pwaConfig(nextConfig);
