import '../styles/app.module.scss'
import '../styles/cells.styles.scss'
import '../styles/Home.module.css'
import '../styles/globals.css'
import { AppPropsWithLayout } from '@/components'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import MainLayout from './components/Layout.tsx/MainLayout'

type AppModel = {
  test: string
}

export const getStaticProps: GetStaticProps<{ appModel: AppModel }> = async (
  context
) => {
  return {
    props: {
      appModel: {
        test: 'a'
      } as AppModel
    },
    revalidate: 5
  }
}

//{ appModel }: InferGetStaticPropsType<typeof getStaticProps>

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  return (
    <>
      <MainLayout component={<Component {...pageProps} />} />
    </>
  )
}
