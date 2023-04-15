import '../styles/app.module.scss'
import '../styles/cells.styles.scss'
import '../styles/Home.module.css'
import '../styles/globals.css'
import { AppPropsWithLayout } from '@/components'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import MainLayout from './components/Layout.tsx/MainLayout'
import { wrapper } from '@/data/src'
import { Provider } from 'react-redux'

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
  const { store, props } = wrapper.useWrappedStore({})
  return (
    <>
      <Provider store={store}>
        <MainLayout component={<Component {...pageProps} />} />
      </Provider>
    </>
  )
}
