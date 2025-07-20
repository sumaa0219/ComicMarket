// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { ProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://cd5274e27d44cd1f302d4175b0cb4c80@o174081.ingest.sentry.io/4506446507999232",

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,
  // Profiling sample rate is relative to tracesSampleRate
  profilesSampleRate: 1.0,

  integrations: [
    // Add profiling integration to list of integrations
    new ProfilingIntegration(),
  ],

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
