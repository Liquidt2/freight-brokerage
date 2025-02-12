/** @type {import('next').NextConfig} */
const nextConfig = {
  // Existing configurations
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['sanity'],
  },

  // Added configurations to handle the build error
  swcMinify: false, // Disable SWC minification
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config
  },
}

// Handle potential environment-specific issues
if (process.env.NODE_ENV === 'development') {
  nextConfig.experimental = {
    ...nextConfig.experimental,
    appDir: true,
  }
}

module.exports = nextConfig