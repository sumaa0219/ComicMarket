const million = require('million/compiler');
//@ts-check

const isProd = process.env.NODE_ENV === "production"

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: isProd,
  openAnalyzer: false
})
const withPWA = require("next-pwa")({
  dest: 'public',
  skipWaiting: true,
  disable: !isProd
});
const { withSentryConfig } = require("@sentry/nextjs");

/**
 * @param {string} name
 * @returns {string}
 */
function env(name) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing env var ${name}`)
  return value
}

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
  // webpack(
  //   /**
  //    * @type {import('webpack').Configuration}
  //    */
  //   config,
  //   { isServer }
  // ) {
  //   if (config.plugins instanceof Array && process.env.NODE_ENV === 'production') {
  //     config.plugins.push(
  //       sentryWebpackPlugin({
  //         org: env("SENTRY_ORG"),
  //         project: env("SENTRY_PROJECT"),

  //         // Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
  //         // and need `project:releases` and `org:read` scopes
  //         authToken: env("SENTRY_AUTH_TOKEN"),
  //         // include: '.next',
  //       }),
  //     )
  //   }
  //   return config
  // }
}

// @ts-ignore
const baConfig = withBundleAnalyzer(withPWA(nextConfig))

module.exports = million.next(
  isProd ? withSentryConfig(
    nextConfig,
    // baConfig,
    {
      // For all available options, see:
      // https://github.com/getsentry/sentry-webpack-plugin#options

      // Suppresses source map uploading logs during build
      silent: true,
      org: env("SENTRY_ORG"),
      project: env("SENTRY_PROJECT"),
      authToken: env("SENTRY_AUTH_TOKEN"),
    },
    {
      // For all available options, see:
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

      // Upload a larger set of source maps for prettier stack traces (increases build time)
      widenClientFileUpload: true,

      // Transpiles SDK to be compatible with IE11 (increases bundle size)
      transpileClientSDK: true,

      // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
      tunnelRoute: "/monitoring",

      // Hides source maps from generated client bundles
      hideSourceMaps: true,

      // Automatically tree-shake Sentry logger statements to reduce bundle size
      disableLogger: true,

      // Enables automatic instrumentation of Vercel Cron Monitors.
      // See the following for more information:
      // https://docs.sentry.io/product/crons/
      // https://vercel.com/docs/cron-jobs
      automaticVercelMonitors: true,
    }
  ) : baConfig,
  {
    mode: "vdom",
    // auto: true,
    // mute: true,
  }
);
