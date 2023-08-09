import '@/styles/globals.css';
import { Analytics } from '@vercel/analytics/react';
import type { AppProps } from 'next/app';
import NextNProgress from 'nextjs-progressbar';
import { Fragment } from 'react';
import Maintenance from './maintenance';

function App({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <NextNProgress />
      <Component {...pageProps} />
      <Analytics />
    </Fragment>
  )
}

// export default App

export default process.env.NEXT_PUBLIC_MAINTENANCE_MODE?.toLowerCase() === 'true'
? Maintenance
: App
