import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import NextNProgress from 'nextjs-progressbar';
import { Fragment } from 'react';
import Maintenance from './maintenance';
import { Analytics } from '@vercel/analytics/react';

export default /*process.env.NEXT_PUBLIC_MAINTENANCE_MODE?.toLowerCase() === 'true'
? Maintenance
:*/ function App({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <NextNProgress />
      <Component {...pageProps} />
      <Analytics />
    </Fragment>
  )
}
