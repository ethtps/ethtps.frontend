/* eslint-disable import/no-internal-modules */
import { Container } from '@mantine/core'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { Text, Notification } from '@mantine/core'
import { queryClient } from '@/services'
import MyResponsiveStream from './components/live data/nivo streamchart/MyResponsiveStream'
import { defaultStyle, defaultRedStyle } from './components/StaticStyles'
import { ProviderResponseModel } from '@/api-client'
import { AllProvidersTable, LivePSPartial, ProviderTable, useSizeRef } from '@/components'
import { useState } from 'react'
import { loadProvidersAsync, setProviders, useAppDispatch, useAppSelector } from '@/data'

type IndexPageModel = {
  providers: ProviderResponseModel[]
}

export const getStaticProps: GetStaticProps<{ model: IndexPageModel }> = async (
  context
) => {
  return {
    props: {
      model: {
        providers: await loadProvidersAsync(queryClient)
      } as IndexPageModel
    },
    revalidate: 120
  }
}



export default function Index({
  model
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const sizeRef = useSizeRef()
  const [openIndex, setOpenIndex] = useState(-1)

  const handleMenuToggle = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }
  return (
    <>
      <Container ref={sizeRef.ref}>
        <LivePSPartial width={sizeRef.width ?? 3000} />
      </Container>
      <br />
      <Container style={{ ...defaultStyle }}>
        <ProviderTable providers={model.providers} />
      </Container>
    </>
  )
}
