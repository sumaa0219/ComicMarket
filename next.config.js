//@ts-check

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.NODE_ENV === "production",
  openAnalyzer: false
})
const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: false,
  // serverRuntimeConfig: {
  //   // SSL証明書と秘密鍵のパスを指定
  //   api: {
  //     bodyParser: {
  //       sizeLimit: '1gb', // ボディサイズ制限を増やす（例: 1GB）
  //     },
  //   },
  // },
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

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, configFile, stripPrefix, urlPrefix, include, ignore

  org: "cabbagelettuce916",
  project: "comicmarket",

  // An auth token is required for uploading source maps.
  // You can get an auth token from https://sentry.io/settings/account/api/auth-tokens/
  // The token must have `project:releases` and `org:read` scopes for uploading source maps
  authToken: process.env.SENTRY_AUTH_TOKEN,

  silent: true, // Suppresses all logs

  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};


module.exports = withSentryConfig({
  ...withBundleAnalyzer(nextConfig),
  sentry: {
    hideSourceMaps: true,
  }
}, sentryWebpackPluginOptions)
