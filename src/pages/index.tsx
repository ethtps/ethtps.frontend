/* eslint-disable import/no-internal-modules */
import { Box, Button, Center, Container, Progress, Stack } from '@chakra-ui/react'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { Text } from '@chakra-ui/react'
import { queryClient } from '@/services'
import MyResponsiveStream from './components/live data/nivo streamchart/MyResponsiveStream'
import { defaultStyle, defaultRedStyle } from './components/StaticStyles'
import { ProviderResponseModel } from '@/api-client'
import { AllProvidersTable, LiveDataContainer, LivePSPartial, ProviderTable } from '@/components'
import { useCallback, useRef, useState } from 'react'
import { loadProvidersAsync, setProviders, useAppDispatch, useAppSelector } from '@/data'
import { Dictionary } from '@reduxjs/toolkit'
import { CustomFooter } from './components/Layout'
import { useSize } from "@chakra-ui/react-use-size"

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
  const containerRef = useRef<any>(null)
  const sizeRef = useSize(containerRef)
  const [openIndex, setOpenIndex] = useState(-1)

  const handleMenuToggle = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index)
  }
  const [currentValue, setCurrentValue] = useState(0)
  const dataReceived = (data: Dictionary<number>) => {

  }
  return (
    <>
      <Box w={'100%'} ref={containerRef}>
        <LivePSPartial
          value={currentValue}
          width={Math.max(sizeRef?.width ?? 500, 750)}
        />
      </Box>
      <br />
      <Center>
        <Stack boxSize={'container.xl'}>
          <AllProvidersTable maxRowsBeforeShowingExpand={20} providerData={model.providers} />
        </Stack>
      </Center>
    </>
  )
}

//<ProviderTable providers={model.providers} />