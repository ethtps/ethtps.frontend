import { Box } from '@chakra-ui/react'
import {
  ETHTPSDataCoreDataType,
  ETHTPSDataCoreModelsResponseModelsProviderResponseModel,
  ETHTPSDataCoreTimeInterval
} from 'ethtps.api'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState, createContext } from 'react'
import {
  AllProvidersTable,
  LiveDataContainer,
  StreamingComponent,
  useLiveDataWithDelta,
  useQueryStringAndLocalStorageBoundState
} from '../ethtps.components'
import {
  GenericDictionary,
  IDataModel,
  L2DataUpdateModel,
  LiveDataAggregator,
  createHandlerFromCallback
} from '../ethtps.data/src'
import { OrderProvidersByMax, api } from '../services'

export interface IIndexPageProps {
  providerData?: ETHTPSDataCoreModelsResponseModelsProviderResponseModel[]
  maxData?: IDataModel
  instantData?: IDataModel
  defaultIntervalData?: IDataModel
}

export const getStaticProps: GetServerSideProps = async (context) => {
  const instant = await api.getInstantData(ETHTPSDataCoreTimeInterval.INSTANT)
  return {
    props: OrderProvidersByMax({
      providerData: await api.getProvidersAsync(),
      maxData: {
        tpsData: await api.getMax(ETHTPSDataCoreDataType.TPS, 'All'),
        gpsData: await api.getMax(ETHTPSDataCoreDataType.GPS, 'All'),
        gtpsData: await api.getMax(
          ETHTPSDataCoreDataType.GAS_ADJUSTED_TPS,
          'All'
        )
      },
      instantData: {
        tpsData: instant[ETHTPSDataCoreDataType.TPS],
        gpsData: instant[ETHTPSDataCoreDataType.GPS],
        gtpsData: instant[ETHTPSDataCoreDataType.GAS_ADJUSTED_TPS]
      },
      defaultIntervalData: {
        tpsData: await api.getData(
          ETHTPSDataCoreDataType.TPS,
          ETHTPSDataCoreTimeInterval.ONE_HOUR,
          'All',
          undefined,
          true
        ),
        gpsData: await api.getData(
          ETHTPSDataCoreDataType.GPS,
          ETHTPSDataCoreTimeInterval.ONE_HOUR,
          'All',
          undefined,
          true
        ),
        gtpsData: await api.getData(
          ETHTPSDataCoreDataType.GAS_ADJUSTED_TPS,
          ETHTPSDataCoreTimeInterval.ONE_HOUR,
          'All',
          undefined,
          true
        )
      }
    } as IIndexPageProps)
  }
}

export default function Index({
  providerData,
  maxData,
  instantData,
  defaultIntervalData
}: IIndexPageProps) {
  // Listen for leave events in order to unmount the streaming component - otherwise we get an error
  const [isLeaving, setIsLeaving] = useState(false)
  const router = useRouter()
  useEffect(() => {
    const incrementStartCount = (url: any) => {
      setIsLeaving(true)
    }
    router.events.on('routeChangeStart', incrementStartCount)
    return () => {
      router.events.off('routeChangeStart', incrementStartCount)
    }
  }, [])
  const aggregator = new LiveDataAggregator()
  const [connected, setConnected] = useState(false)
  const noSidechainAggregator = new LiveDataAggregator()
  const [copiedAggregator, setCopiedAggregator] = useState<LiveDataAggregator>() // [0_1] We use this in order to trigger a re-render when new data arrives
  const modeHandler = createHandlerFromCallback<ETHTPSDataCoreDataType>(
    (newValue) => { }
  )
  const [showSidechains, setShowSidechains] =
    useQueryStringAndLocalStorageBoundState(false, 'showSidechains')
  const noSidechainData = useLiveDataWithDelta()
  const { data, setTPS, setGPS } = useLiveDataWithDelta()
  const [newestData, setNewestData] =
    useState<GenericDictionary<L2DataUpdateModel>>()
  const onDataReceived = (liveData: GenericDictionary<L2DataUpdateModel>) => {
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
  const [dataMode, setDataMode] =
    useQueryStringAndLocalStorageBoundState<ETHTPSDataCoreDataType>(
      ETHTPSDataCoreDataType.TPS,
      'dataType'
    )
  const [hoveredDataMode, setHoveredDataMode] = useState<
    ETHTPSDataCoreDataType | undefined
  >(dataMode)
  const onClick = (dataType: ETHTPSDataCoreDataType) => {
    setDataMode(dataType)
  }
  const onMouseOver = (dataType: ETHTPSDataCoreDataType) => {
    setHoveredDataMode(dataType)
  }
  const onMouseLeave = (dataType: ETHTPSDataCoreDataType) => {
    setHoveredDataMode(undefined)
  }
  const getFilteredProviderData = () =>
    providerData?.filter((x) =>
      showSidechains ? true : x.type !== 'Sidechain'
    )
  return (
    <>
      <LiveDataContainer
        onConnected={() => setConnected(true)}
        onDisconnected={() => setConnected(false)}
        onError={(error) => console.error(error)}
        onDataReceived={onDataReceived}
        component={
          <>
            <Box>
              <StreamingComponent
                connected={connected}
                data={showSidechains ? data : noSidechainData.data}
                newestData={newestData}
                providerData={providerData}
                onClick={onClick}
                onMouseOver={onMouseOver}
                onMouseLeave={onMouseLeave}
                isLeaving={isLeaving}
                dataMode={dataMode ?? ETHTPSDataCoreDataType.TPS}
                hoveredDataMode={hoveredDataMode}
                showSidechains={showSidechains ?? false}
                showSidechainsToggled={() => setShowSidechains(!showSidechains)}
              />
            </Box>
            <Box
              sx={{
                marginTop: '5rem',
              }}
              overflowX={'scroll'}>
              <AllProvidersTable
                maxData={maxData}
                api={api}
                instantData={instantData}
                providerData={getFilteredProviderData()}
                aggregator={copiedAggregator}
                dataType={hoveredDataMode ?? dataMode}
                showSidechains={showSidechains}
                maxRowsBeforeShowingExpand={25}
              />
            </Box>
          </>
        }
      />
    </>
  )
}
