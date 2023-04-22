/* eslint-disable import/no-internal-modules */
import { Container } from '@mantine/core'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { Text, Notification } from '@mantine/core'
import { getAPIKey, queryClient } from '@/services'
import MyResponsiveStream from './components/live data/nivo streamchart/MyResponsiveStream'
import { defaultStyle, defaultRedStyle } from './components/StaticStyles'
import { ProviderResponseModel } from '@/api-client'
import { AllProvidersTable, ProviderTable, useSizeRef } from '@/components'

type IndexPageModel = {
  providers: ProviderResponseModel[]
}

export const getStaticProps: GetStaticProps<{ model: IndexPageModel }> = async (
  context
) => {
  let response: Response | undefined
  let providers: ProviderResponseModel[] | undefined

  let retryCount = 0
  do {
    try {
      response = await queryClient.fetchQuery('providers', async () => await fetch(`http://localhost:10202/api/v2/Providers?XAPIKey=${getAPIKey()}`))
      providers = JSON.parse(await response?.text() ?? "[]")
    }
    catch {
      retryCount++
    }
  }
  while (!providers && (providers ?? []).length === 0)

  if (!providers || providers?.length === 0) {
    throw new Error("Couldn't load providers")
  }

  return {
    props: {
      model: {
        providers: providers
      } as IndexPageModel
    },
    revalidate: 5
  }
}



export default function Index({
  model
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const sizeRef = useSizeRef()
  return (
    <>
      <Container ref={sizeRef.ref} style={{ height: 500 }}>
        <MyResponsiveStream width={sizeRef.width} height={sizeRef.height} />
      </Container>
      <br />
      <Container style={{ ...defaultStyle }}>
        <ProviderTable providers={model.providers} />
      </Container>
    </>
  )
}
