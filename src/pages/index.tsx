/* eslint-disable import/no-internal-modules */
import { Box, Center, Container, Stack } from '@chakra-ui/react'
import { AllProvidersTable, LivePSPartial, SimpleLiveDataStat } from '@/components'
import { Suspense, useRef, useState } from 'react'
import { useSize } from "@chakra-ui/react-use-size"
import Loading from './components/Loading'
import { GetServerSideProps } from 'next'
import { DataType, ProviderResponseModel } from '@/api-client'
import { api, getAsync } from '@/services'
import { DataPointDictionary, IMaxDataModel, setMaxTPSData, useAppDispatch } from '@/data'

interface IIndexPageProps {
  providerData?: ProviderResponseModel[]
  maxData?: IMaxDataModel
}

export const getStaticProps: GetServerSideProps = async (context) => {
  return {
    props: {
      providerData: await api.getProvidersAsync(),
      maxData: {
        maxGTPSData: await api.getMax(DataType.Tps),
        maxGPSData: await api.getMax(DataType.Gps),
      }
    } as IIndexPageProps
  }
}

export default function Index({ providerData, maxData }: IIndexPageProps) {
  const containerRef = useRef<any>(null)
  const sizeRef = useSize(containerRef)
  const [currentValue, setCurrentValue] = useState(0)
  return (
    <>
      <Container>
        <SimpleLiveDataStat />
      </Container>
      <Box w={'100%'} ref={containerRef}>
        <Center>
          <LivePSPartial
            value={currentValue}
            width={Math.max((sizeRef?.width ?? 0) * 0.95 ?? 500, 750)}
          />
        </Center>
      </Box>
      <br />
      <Center>
        <Stack overflow={'scroll'} boxSize={'container.xl'}>
          <AllProvidersTable maxData={maxData} providerData={providerData} maxRowsBeforeShowingExpand={25} />
        </Stack>
      </Center>
    </>
  )
}