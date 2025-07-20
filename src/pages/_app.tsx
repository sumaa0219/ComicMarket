import '@/styles/globals.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { AppProps } from 'next/app';
import NextNProgress from 'nextjs-progressbar';
import { Fragment } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <NextNProgress />
      <Component {...pageProps} />
      {
        global?.window?.location.hostname !== 'localhost' && <Fragment>
          <SpeedInsights />
          <Analytics />
        </Fragment>
      }
    </Fragment>
  )
}
