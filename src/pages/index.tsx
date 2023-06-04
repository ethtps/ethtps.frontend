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
import { StreamingComponent } from '@/components/instant data animations/streaming/StreamingComponent'

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
  const [connected, setConnected] = useState(false)
  const aggregator = new LiveDataAggregator()
  const noSidechainAggregator = new LiveDataAggregator()
  const [copiedAggregator, setCopiedAggregator] = useState<LiveDataAggregator>() // [0_1] We use this in order to trigger a re-render when new data arrives
  const modeHandler = createHandlerFromCallback<DataType>((newValue) => {
    console.log(newValue)
  })
  const [showSidechains, setShowSidechains] = useState(false)
  const noSidechainData = useLiveDataWithDelta()
  const { data, setTPS, setGPS } = useLiveDataWithDelta()
  const [newestData, setNewestData] = useState<Dictionary<L2DataUpdateModel>>()
  const onDataReceived = (liveData: Dictionary<L2DataUpdateModel>) => {
    aggregator.updateMultiple(liveData)
    const average = aggregator.average
    setTPS(average.tps)
    setGPS(average.gps)
    noSidechainAggregator.updateMultiple(liveData, true, providerData)
    noSidechainData.setTPS(noSidechainAggregator.average.tps)
    noSidechainData.setGPS(noSidechainAggregator.average.gps)
    setNewestData(liveData)
    setCopiedAggregator(aggregator) // [0_2] Trigger
  }
  const [hoveredDataMode, setHoveredDataMode] = useState<DataType | undefined>(DataType.Tps)
  const [dataMode, setDataMode] = useState<DataType>(DataType.Tps)
  const onClick = (dataType: DataType) => {
    setDataMode(dataType)
  }
  const onMouseOver = (dataType: DataType) => {
    setHoveredDataMode(dataType)
  }
  const onMouseLeave = (dataType: DataType) => {
    setHoveredDataMode(undefined)
  }
  const getFilteredProviderData = () => providerData?.filter(x => showSidechains ? true : x.type !== "Sidechain")
  return (
    <>
      <LiveDataContainer
        onConnected={() => setConnected(true)}
        onDisconnected={() => setConnected(false)}
        onError={(error) => console.error(error)}
        onDataReceived={onDataReceived}
        component={<>
          <StreamingComponent
            connected={connected}
            data={showSidechains ? data : noSidechainData.data}
            newestData={newestData}
            providerData={providerData}
            onClick={onClick}
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
            dataMode={dataMode}
            hoveredDataMode={hoveredDataMode}
            showSidechains={showSidechains}
            showSidechainsToggled={() => setShowSidechains(!showSidechains)}
          />
          <br />
          <Box overflow={'scroll'} >
            <AllProvidersTable
              maxData={maxData}
              providerData={getFilteredProviderData()}
              aggregator={copiedAggregator}
              dataType={hoveredDataMode ?? dataMode}
              showSidechains={showSidechains}
              maxRowsBeforeShowingExpand={25} />
          </Box>
        </>
        } />
    </>
  )
}