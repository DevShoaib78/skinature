import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // react-pdf ships its own binaries/fonts; keep it out of the bundler.
  serverExternalPackages: ['@react-pdf/renderer'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    // Legacy numeric product URLs → slug URLs
    return [
      { source: '/product/1', destination: '/product/brightening-cleansing-mask', permanent: true },
      { source: '/product/2', destination: '/product/root-revival-hair-mask-cocktail', permanent: true },
      { source: '/product/3', destination: '/product/root-revival-hair-oil', permanent: true },
      { source: '/product/4', destination: '/product/hair-care-kit', permanent: true },
      { source: '/product/5', destination: '/product/bridal-kit', permanent: true },
    ];
  },
};

export default nextConfig;
