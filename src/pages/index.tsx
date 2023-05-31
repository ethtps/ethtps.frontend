/* eslint-disable import/no-internal-modules */
import { Box, Center, Container, Stack } from '@chakra-ui/react'
import { AllProvidersTable, DataModeButtonGroup, LiveDataContainer, LivePSPartial, SimpleBarStat, SimpleLiveDataStat, useLiveDataWithDelta } from '@/components'
import { Suspense, useRef, useState } from 'react'
import { useSize } from "@chakra-ui/react-use-size"
import Loading from './components/Loading'
import { GetServerSideProps } from 'next'
import { DataType, ProviderResponseModel } from '@/api-client'
import { api, getAsync } from '@/services'
import { DataPointDictionary, IMaxDataModel, L2DataUpdateModel, LiveDataAggregator, createHandlerFromCallback, setMaxTPSData, useAppDispatch, useHandler } from '@/data'
import { Dictionary } from '@reduxjs/toolkit'

interface IIndexPageProps {
  providerData?: ProviderResponseModel[]
  maxData?: IMaxDataModel
}

export const getStaticProps: GetServerSideProps = async (context) => {
  return {
    props: {
      providerData: await api.getProvidersAsync(),
      maxData: {
        maxTPSData: await api.getMax(DataType.Tps),
        maxGPSData: await api.getMax(DataType.Gps),
        maxGTPSData: await api.getMax(DataType.GasAdjustedTps)
      }
    } as IIndexPageProps
  }
}

export default function Index({ providerData, maxData }: IIndexPageProps) {
  const containerRef = useRef<any>(null)
  const [connected, setConnected] = useState(false)
  const sizeRef = useSize(containerRef)
  const aggregator = new LiveDataAggregator()
  const [copiedAggregator, setCopiedAggregator] = useState<LiveDataAggregator>() // [0_1] We use this in order to trigger a re-render when new data arrives
  const modeHandler = createHandlerFromCallback<DataType>((newValue) => {
    console.log(newValue)
  })
  const { data, setTPS, setGPS } = useLiveDataWithDelta()
  const [newestData, setNewestData] = useState<Dictionary<L2DataUpdateModel>>()
  const onDataReceived = (liveData: Dictionary<L2DataUpdateModel>) => {
    aggregator.updateMultiple(liveData)
    const average = aggregator.average
    setTPS(average.tps)
    setGPS(average.gps)
    setNewestData(liveData)
    setCopiedAggregator(aggregator) // [0_2] Trigger
  }

  return (
    <>
      <DataModeButtonGroup modeHandle={modeHandler} />
      <LiveDataContainer
        onConnected={() => setConnected(true)}
        onDisconnected={() => setConnected(false)}
        onError={(error) => console.error(error)}
        onDataReceived={onDataReceived}
        component={<>
          <Container>
            <SimpleLiveDataStat connected={connected} data={{
              tps: data.tps,
              gps: data.gps,
              gtps: data.gtps
            }} />
          </Container>
          <Box w={'100%'} overflow={'scroll'} ref={containerRef}>
            <Center>
              <SimpleBarStat newestData={newestData} width={Math.max((sizeRef?.width ?? 0) * 0.95 ?? 500, 750)} height={500} />
            </Center>
          </Box>
          <br />
          <Center>
            <Stack overflow={'scroll'} boxSize={'container.xl'}>
              <AllProvidersTable
                maxData={maxData}
                providerData={providerData}
                aggregator={copiedAggregator}
                dataType={DataType.Tps}
                maxRowsBeforeShowingExpand={25} />
            </Stack>
          </Center>
        </>
        } />
    </>
  )
}