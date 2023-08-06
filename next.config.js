//@ts-check

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.NODE_ENV === "production",
  openAnalyzer: false
})
const { withSentryConfig } = require("@sentry/nextjs");
const withPWA = require("next-pwa")({
  dest: 'public',
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});
const sentryWebpackPlugin = require("@sentry/webpack-plugin");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
  webpack(
    /**
     * @type {import('webpack').Configuration}
     */
    config,
    { isServer }
  ) {
    if (config.plugins instanceof Array && process.env.NODE_ENV === 'production') {
      config.plugins.push(
        new sentryWebpackPlugin({
          org: process.env.SENTRY_ORG,
          project: process.env.SENTRY_PROJECT,

          // Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
          // and need `project:releases` and `org:read` scopes
          authToken: process.env.SENTRY_AUTH_TOKEN,
          include: '.next',
        }),
      )
    }
    return config
  }
}

/**
 * @type {import('@sentry/nextjs').SentryWebpackPluginOptions}
 */
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
  include: ".next",
};

/**
 * @param {import('@sentry/nextjs/types/config/types').NextConfigObjectWithSentry} config
 * @param {import('@sentry/nextjs').SentryWebpackPluginOptions} options
 */
function passSentry(config, options) {
  const { sentry: _sentry, ...configWithoutSentry } = config
  return process.env.NODE_ENV === "production" ? withSentryConfig(config, options) : configWithoutSentry
}

module.exports = passSentry({
  ...withBundleAnalyzer(withPWA(nextConfig)),
  sentry: {
    hideSourceMaps: true,
    widenClientFileUpload: true,
    disableLogger: true,
    tunnelRoute: "/monitoring",
  }
}, sentryWebpackPluginOptions)
