const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const nextConfig = {
  experimental: {
    appDir: true,
  },
  reactStrictMode: false,
};

if (process.env.ANALYZE === 'true') {
  module.exports = withBundleAnalyzer({})
} else {
  module.exports = nextConfig;
}