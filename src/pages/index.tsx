/* eslint-disable import/no-internal-modules */
import { Container } from '@mantine/core'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { Text, Notification } from '@mantine/core'
import { AllProvidersTable, AnimationSelector, useSizeRef } from '@/components'
import { getAPIKey } from '@/services'
import MyResponsiveStream from './components/live data/nivo streamchart/MyResponsiveStream'
import { ProviderTable } from '@/components'
import { defaultStyle, defaultRedStyle } from './components/StaticStyles'

type IndexPageModel = {
  providers: string[]
}

export const getStaticProps: GetStaticProps<{ model: IndexPageModel }> = (
  context
) => {
  return {
    props: {
      model: {
        providers: ['Ethereum']
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
        <AllProvidersTable width={sizeRef.width} />
      </Container>
      <Container style={{ ...defaultStyle }}>
        <Text>Provider chart container</Text>
      </Container>
      <Notification title='Debug info'>
        <Text>API key: {getAPIKey()}</Text>
      </Notification>
    </>
  )
}
