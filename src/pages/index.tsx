/* eslint-disable import/no-internal-modules */
import { DataType, ProviderResponseModel, TimeInterval } from '@/api-client'
import { AllProvidersTable, LiveDataContainer, useLiveDataWithDelta } from '@/components'
import { StreamingComponent } from '@/components/instant data animations/streaming/StreamingComponent'
import { IDataModel, L2DataUpdateModel, LiveDataAggregator, createHandlerFromCallback } from '@/data'
import { api } from '@/services'
import { OrderProvidersByMax } from '@/services/experiments/index/OrderProviders'
import { Box } from '@chakra-ui/react'
import { Dictionary } from '@reduxjs/toolkit'
import { GetServerSideProps } from 'next'
import { useState } from 'react'

export interface IIndexPageProps {
  providerData?: ProviderResponseModel[]
  maxData?: IDataModel
  instantData?: IDataModel
  defaultIntervalData?: IDataModel
}

export const getStaticProps: GetServerSideProps = async (context) => {
  const instant = await api.getInstantData(TimeInterval.Instant)
  return {
    props: OrderProvidersByMax({
      providerData: await api.getProvidersAsync(),
      maxData: {
        tpsData: await api.getMax(DataType.Tps, "All"),
        gpsData: await api.getMax(DataType.Gps, "All"),
        gtpsData: await api.getMax(DataType.GasAdjustedTps, "All")
      },
      instantData: {
        tpsData: instant['tps'],
        gpsData: instant['gps'],
        gtpsData: instant['gasAdjustedTps'],
      },
      defaultIntervalData: {
        tpsData: await api.getData(DataType.Tps, TimeInterval.OneHour, "All", undefined, true),
        gpsData: await api.getData(DataType.Gps, TimeInterval.OneHour, "All", undefined, true),
        gtpsData: await api.getData(DataType.GasAdjustedTps, TimeInterval.OneHour, "All", undefined, true),
      }
    } as IIndexPageProps)
  }
}

export default function Index({ providerData, maxData, instantData, defaultIntervalData }: IIndexPageProps) {
  console.clear()
  console.info(defaultIntervalData)
  const aggregator = new LiveDataAggregator()
  const [connected, setConnected] = useState(false)
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

          <Box>
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
          </Box>
          <br />
          <Box overflow={'scroll'} >
            <AllProvidersTable
              maxData={maxData}
              instantData={instantData}
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