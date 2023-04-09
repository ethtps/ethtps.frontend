import '../../..//App.css'
import {
  globalGeneralApi,
  formatModeName,
  globalInstantDataService
} from '../../../services/common'
import {
  colorDictionary
} from '../../../services/defaultData'
import { useState } from 'react'
import { DataStatByType } from './components/instant-stats'
import ModeSelector from './ModeSelector'
import HistoricalChart from '../../charts/HistoricalChart'
import { Helmet } from 'react-helmet'
import IntervalSlider from '../../IntervalSlider'
import { LargeHeader } from '../../Headers/LargeHeader'
import { DefaultRequestParameters } from '../../../models/Common'
import {
  useExcludeNonGeneralPurposeNetworks,
  useExcludeSidechains,
  useMode,
  useNetwork,
  useSmoothing
} from '../../../hooks/ETHTPSHooks'
import { HomePageResponseModel } from '../../../services/api-client/src/models/HomePageResponseModel'
import { DataType } from '../../../services/api-client/src/models/DataType'

export function MainPage() {
  const networkHook = useNetwork()
  const ENGPNHook = useExcludeNonGeneralPurposeNetworks()
  const modeHook = useMode()
  const smoothingHook = useSmoothing()
  const excludeSidechainsHook = useExcludeSidechains()
  const [offline, setOffline] = useState(false)
  const [homePageModel, setHomePageModel] = useState<HomePageResponseModel | undefined>()

  const updateInstantTPS = (data) => {
    try {
      if (homePageModel) homePageModel.instantData = data[modeHook.mode]
      setHomePageModel(homePageModel)
      if (offline) {
        setOffline(false)
      }
    } catch {
      if (!offline) {
        setOffline(true)
      }
    }
  }

  globalGeneralApi.aPIV2MaxGet(
    {
      provider: 'All',
      network: networkHook.network,
      ...DefaultRequestParameters,
      includeSidechains: !excludeSidechainsHook.excludeSidechains
    },
    (err, data: HomePageResponseModel | undefined, res) => {
      setHomePageModel(data)
    }
  )
  globalInstantDataService.periodicallyGetInstantDataForPage({
    pageName: 'MainPage',
    callback: updateInstantTPS.bind(this),
    includeSidechains: !excludeSidechainsHook.excludeSidechains,
    smoothing: smoothingHook.smoothing
  })

  const handleExcludeSidechaisnInputChange = (event) => {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    excludeSidechainsHook.setExcludeSidechains(value)
    globalInstantDataService.includeSidechains = !value
    globalInstantDataService.getAndCallbackInstantData()
  }

  const handleExcludeNonGeneralPurposeNetworksInputChange = (event) => {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    ENGPNHook.setExcludeNonGeneralPurposeNetworks(value)
  }

  const getFilteredInstantData = (state) => {
    let result = state.homePageModel?.selectedInstantData
    if (state.excludeSidechains) {
      let filteredInstantTPSData = {}
      for (let p of state.homePageModel?.providerData) {
        if (
          state.homePageModel?.providerData.filter(
            (x) => x.name == p.name && x.type !== 'Sidechain'
          )
        ) {
          filteredInstantTPSData[p.name] =
            state.homePageModel?.selectedInstantData[p.name]
        }
      }
      result = filteredInstantTPSData
    }
    if (state.excludeNonGeneralPurposeNetworks) {
      let filteredInstantTPSData = {}
      for (let p of state.homePageModel?.providerData) {
        if (
          state.homePageModel?.providerData.filter(
            (x) => x.name == p.name && x.isGeneralPurpose
          )
        ) {
          filteredInstantTPSData[p.name] =
            state.homePageModel?.selectedInstantData[p.name]
        }
      }
      result = filteredInstantTPSData
    }
    return result
  }

  const getProviderData = () => {
    let result = homePageModel?.providers
    if (excludeSidechainsHook.excludeSidechains) {
      result = result?.filter((x) => x.type !== 'Sidechain')
    }
    if (ENGPNHook.excludeNonGeneralPurposeNetworks) {
      result = result?.filter((x) => x.isGeneralPurpose)
    }
    return result
  }

  const intervalSliderChanged = (interval) => {
    smoothingHook.setSmoothing(interval)
    globalInstantDataService.smoothing = interval
    globalInstantDataService.getAndCallbackInstantData()
  }

  const modeChanged = (mode: DataType) => {
    modeHook.setMode(mode)
    globalInstantDataService.getAndCallbackInstantData()
  }
  let optionalGasAdjustedText = ''
  if (modeHook.mode === DataType.GasAdjustedTps) {
    optionalGasAdjustedText =
      'The gas-adjusted TPS value of a network is calculated by dividing the total gas used by the network at any time by 21,000 gas (the gas cost of a simple ETH transfer). In other words, this value represents the theoretical number of transactions per second a network were to do if all transactions were simple ETH transfers.'
  }
  let offlineCircle = (
    <div
      style={{ marginLeft: '10px', verticalAlign: 'center' }}
      className={'tooltip'}>
      ⚠️
      <span className={'tooltiptext'}>
        Live updates are currently unavailable
      </span>
    </div>
  )
  return (
    <>
      <LargeHeader />
      <Helmet>
        <title>Live Ethereum TPS data</title>
      </Helmet>
      <ModeSelector
        defaultMode={modeHook.mode}
        onChange={modeChanged.bind(this)}
      />
      <div style={{ display: 'inline-block' }}>
        <h3 style={{ display: 'inline' }}>
          Current {formatModeName(modeHook.mode)} overview
        </h3>
        {offline ? offlineCircle : <></>}
      </div>
      <p>{optionalGasAdjustedText}</p>
      <DataStatByType
        excludeSidechains={excludeSidechainsHook.excludeSidechains}
        colorDictionary={colorDictionary}
        data={homePageModel?.instantData}
        allData={homePageModel?.instantData}
        providerData={getProviderData()}
        providerTypeColorDictionary={homePageModel?.providerTypesColorDictionary}
        mode={modeHook.mode}
        smoothing={smoothingHook.smoothing}
        split='network'
      />
      <IntervalSlider onChange={intervalSliderChanged.bind(this)} />
      <label className={'small'}>
        <input
          name='excludeSidechains'
          type='checkbox'
          checked={excludeSidechainsHook.excludeSidechains}
          onChange={handleExcludeSidechaisnInputChange.bind(this)}
        />
        Exclude sidechains
      </label>
      <label className={'small'}>
        <input
          name='excludeNonGeneralPurposeNetworks'
          type='checkbox'
          checked={ENGPNHook.excludeNonGeneralPurposeNetworks}
          onChange={handleExcludeNonGeneralPurposeNetworksInputChange.bind(
            this
          )}
        />
        Exclude non-general purpose networks
      </label>
      <p>
        Drag the slider above to change the period of the chart and compare the
        historical {formatModeName(modeHook.mode)} distribution.
      </p>
      <hr />

      <h3>Networks</h3>
      <hr />
      <h3>Historical {formatModeName(modeHook.mode)} distribution</h3>
      <p>
        This is a stacked line chart of all networks&apos historical throughput.
      </p>
      <HistoricalChart
        height={200}
        interval='1m'
        mode={modeHook.mode}
        colorDictionary={homePageModel?.colorDictionary}
        provider='All'
        scale='lin'
        network={networkHook.network}
      />
    </>
  )
}
export default MainPage
