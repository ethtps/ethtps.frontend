/* eslint-disable import/no-internal-modules */
import { Box, Button, Center, Container, Kbd, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, useDisclosure } from '@chakra-ui/react'
import { AllProvidersTable, DataModeButtonGroup, LiveDataContainer, LivePSPartial, SimpleBarStat, SimpleLiveDataStat, StreamingTest, useData, useLiveDataWithDelta } from '@/components'
import { Suspense, useMemo, useRef, useState } from 'react'
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
  const [dataMode, setDataMode] = useState<DataType>(DataType.Tps)
  const [hoveredDataMode, setHoveredDataMode] = useState<DataType | undefined>(DataType.Tps)
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
  const onClick = (dataType: DataType) => {
    setDataMode(dataType)
  }
  const onMouseOver = (dataType: DataType) => {
    setHoveredDataMode(dataType)
  }
  const onMouseLeave = (dataType: DataType) => {
    setHoveredDataMode(undefined)
  }
  const liveStat = useMemo(() => {
    return <Container
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
        onClick={onClick}
        onMouseLeave={onMouseLeave}
        onMouseOver={onMouseOver}
        currentDataType={hoveredDataMode ?? dataMode}
        data={data}
        w={sizeRef?.width} />
      <Box w={sizeRef?.width} h={sizeRef?.height} bg={colors.tertiary} borderRadius="lg" overflow="scroll">
        <div style={{
          float: 'right',
        }}>
        </div>
        <StreamingTest
          dataType={hoveredDataMode ?? dataMode}
          newestData={newestData}
          connected={connected}
          providerData={providerData}
          width={sizeRef?.width}
          data={streamData}
          height={sizeRef?.height} />
      </Box>
    </Container>
  }, [connected, data, newestData, sizeRef?.width, sizeRef?.height, streamData, providerData, colors.tertiary, hoveredDataMode, dataMode])
  return (
    <>
      <LiveDataContainer
        onConnected={() => setConnected(true)}
        onDisconnected={() => setConnected(false)}
        onError={(error) => console.error(error)}
        onDataReceived={onDataReceived}
        component={<>
          <Box
            ref={containerRef}>
            {liveStat}
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