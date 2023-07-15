import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import NextNProgress from 'nextjs-progressbar';
import { Fragment } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <NextNProgress />
      <Component {...pageProps} />
    </Fragment>
  )
}
