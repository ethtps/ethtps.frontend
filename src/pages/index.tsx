/* eslint-disable import/no-internal-modules */
import { Box, Center, Container, Kbd, Stack } from '@chakra-ui/react'
import { AllProvidersTable, DataModeButtonGroup, LiveDataContainer, LivePSPartial, SimpleBarStat, SimpleLiveDataStat, useData, useLiveDataWithDelta } from '@/components'
import { Suspense, useRef, useState } from 'react'
import { useSize } from "@chakra-ui/react-use-size"
import Loading from './components/Loading'
import { GetServerSideProps } from 'next'
import { DataType, ProviderResponseModel } from '@/api-client'
import { api, conditionalRender, getAsync, useColors } from '@/services'
import { DataPointDictionary, IMaxDataModel, L2DataUpdateModel, LiveDataAggregator, createHandlerFromCallback, setMaxTPSData, useAppDispatch, useHandler } from '@/data'
import { Dictionary } from '@reduxjs/toolkit'
import { D3Stream } from '@/components'

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
  const sizeRef = useSize(containerRef)

  const [connected, setConnected] = useState(false)
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
  const streamData = useData()
  const colors = useColors()
  return (
    <>
      <LiveDataContainer
        onConnected={() => setConnected(true)}
        onDisconnected={() => setConnected(false)}
        onError={(error) => console.error(error)}
        onDataReceived={onDataReceived}
        component={<>
          <Box
            w={'100%'}
            ref={containerRef}>
            <Container
              h={500}
              w={sizeRef?.width}
              sx={{
                margin: 0,
                padding: 0,
              }}>
              <SimpleLiveDataStat
                absolute
                fillWidth
                connected={connected}
                data={data}
                w={sizeRef?.width} />
              <Box w={sizeRef?.width} h={sizeRef?.height} bg={colors.tertiary} borderRadius="lg" overflow="hidden">
                <D3Stream
                  newestData={newestData}
                  connected={connected}
                  width={sizeRef?.width}
                  data={streamData}
                  height={500} />

              </Box>
            </Container>

          </Box>
          <br />

          <Box overflow={'scroll'} >
            <AllProvidersTable
              maxData={maxData}
              providerData={providerData}
              aggregator={copiedAggregator}
              dataType={DataType.Tps}
              maxRowsBeforeShowingExpand={25} />
          </Box>
        </>
        } />
    </>
  )
}