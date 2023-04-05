import { AppPropsWithLayout } from '@/components'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import MainLayout from './components/Layout.tsx/MainLayout'
import { ETHTPSApi } from '@/services/api/ETHTPSAPI'
import { ProviderResponseModel } from '@/data/src'
import { QueryClient } from 'react-query'
import { ApplicationDataService, getAsync } from '@/services/flows'

type IndexPageModel = {
  providers: ProviderResponseModel[]
}

export const getStaticProps: GetStaticProps<{ model: IndexPageModel }> = async (
  context
) => {
  const api = new ETHTPSApi("http://localhost:10202" ) //dotenv hangs for some reason and I don't feel like debugging it
  const queryClient = new QueryClient()
  const providers = await queryClient.fetchQuery(
            'ssr-providers',
            async () => await api.getProvidersAsync(),
            {
                retry: true,
                retryDelay: 2500
            }
        )
  return {
    props: {
      model: {
        providers: providers ?? null
      } as IndexPageModel
    },
    revalidate: 5
  }
}

export default function Index({ model }: InferGetStaticPropsType<typeof getStaticProps> ) {
  return <>
  What: {JSON.stringify(model)}
  </>
}
