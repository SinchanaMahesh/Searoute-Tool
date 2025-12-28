/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
  experimental: {
    typedRoutes: false,
    serverComponentsExternalPackages: ['searoute-js', 'geojson-path-finder', 'tinyqueue'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize problematic dependencies for server-side
      config.externals = config.externals || [];
      config.externals.push({
        'tinyqueue': 'commonjs tinyqueue',
        'geojson-path-finder': 'commonjs geojson-path-finder',
        'searoute-js': 'commonjs searoute-js',
      });
    }
    
    // Ignore problematic modules in client bundle
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    return config;
  },
};

export default nextConfig;


