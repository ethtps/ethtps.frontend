import { NextPage } from 'next'
// eslint-disable-next-line import/no-internal-modules
import { AppProps } from 'next/app'
import { ReactElement, ReactNode } from 'react'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}
