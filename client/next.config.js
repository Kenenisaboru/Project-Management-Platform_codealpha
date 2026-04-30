/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Docker standalone deployment
  output: 'standalone',

  // Allow images from the backend server
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/static/**',
      },
    ],
  },

  // Suppress the known ESLint build warnings from Tiptap
  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    // Type errors are caught in development; don't block production builds
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
