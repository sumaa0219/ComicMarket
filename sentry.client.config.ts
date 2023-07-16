import * as Sentry from "@sentry/nextjs";
import { ExportedNextConfig } from "@sentry/nextjs/types/config/types";

Sentry.init({
  dsn: "https://12c0792a7a334bfdbafda42acc68f722@o174081.ingest.sentry.io/4505537713340416",
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});


type a = ExportedNextConfig