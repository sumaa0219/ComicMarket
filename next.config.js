const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.NODE_ENV === "production",
  openAnalyzer: false
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: false,
  serverRuntimeConfig: {
    // SSL証明書と秘密鍵のパスを指定
    api: {
      bodyParser: {
        sizeLimit: '1gb', // ボディサイズ制限を増やす（例: 1GB）
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        port: '',
        pathname: '/a/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = withBundleAnalyzer(nextConfig)
