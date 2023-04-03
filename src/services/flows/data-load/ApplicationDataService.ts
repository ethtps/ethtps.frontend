import { ETHTPSApi } from '@/services/api/ETHTPSAPI'
import { QueryClient } from 'react-query'
import { setNetworks } from '@/data/src/slices/NetworksSlice'
import { getAPIKey, setAPIKey } from '@/services/DependenciesIOC'
import { AppDispatch } from '../../../data/src/store'
import {
  setProviderColorDictionary,
  setProviderTypeColorDictionary
} from '@/data/src/slices/ColorSlice'
import { Handler, setExperiments } from '@/data/src'
import { setIntervals } from '@/data/src/slices/IntervalsSlice'
import { setProviders } from '@/data/src/slices/ProvidersSlice'
import {
  setMaxGPSData,
  setMaxGTPSData,
  setMaxTPSData
} from '@/data/src/slices/DataSlice'
import { DataType } from '@/api-client/src/models'
import { ApiV2NetworksGetRequest } from '../../../api-client/src/apis/GeneralApi'

let progressChangedHandler: Handler<number> | undefined

export class ApplicationDataService {
  private loaders = [() => {}]
  private loadedCount = 0
  constructor(
    private api: ETHTPSApi,
    private queryClient: QueryClient,
    progressChanged?: Handler<number>
  ) {
    progressChangedHandler = progressChanged
  }

  private setLoadees(dispatch: AppDispatch, api: ETHTPSApi) {
    this.addLoadee<Array<string>>(
      'networks',
      async (api) => await api.getNetworksAsync(),
      (v) => {
        dispatch(setNetworks(v))
        if (
          this.loadedCount >= this.loaders.length &&
          this.loaders.length > 0
        ) {
          this.loadedCount = this.loaders.length
        }
      }
    )
    this.addLoadee(
      'provider-color-dictionary',
      async (api) => await api.getProviderColorDictionary(),
      (v) => dispatch(setProviderColorDictionary(v))
    )
    this.addLoadee(
      'provider-type-color-dictionary',
      async (api) => await api.getProviderTypeColorDictionary(),
      (v) => dispatch(setProviderTypeColorDictionary(v))
    )
    this.addLoadee(
      'intervals',
      async (api) => await api.getIntervals(),
      (v) => dispatch(setIntervals(v))
    )
    this.addLoadee(
      'providers',
      async (api) => await api.getProviders(),
      (v) => dispatch(setProviders(v))
    )
    this.addLoadee(
      'max-tps',
      async (api) => await api.getMax(DataType.Tps),
      (v) => dispatch(setMaxTPSData(v))
    )
    this.addLoadee(
      'max-gtps',
      async (api) => await api.getMax(DataType.GasAdjustedTps),
      (v) => dispatch(setMaxGTPSData(v))
    )
    this.addLoadee(
      'max-gps',
      async (api) => await api.getMax(DataType.Gps),
      (v) => dispatch(setMaxGPSData(v))
    )
    this.addLoadee(
      'get-experiments',
      async (api) => await api.getAvailableExperiments('Desktop'),
      (v) => dispatch(setExperiments(v))
    )
  }

  private addLoadee<T>(
    name: string,
    getter: (api: ETHTPSApi) => Promise<T>,
    setter: (value: T) => void
  ) {
    this.loaders.push(async () => {
      const data = await this.queryClient.fetchQuery(
        name,
        async () => await getter(this.api),
        {
          retry: true,
          retryDelay: 2500,
          cacheTime: 60000
        }
      )
      setter(data)
      this.loadedCount++
      if (progressChangedHandler) {
        progressChangedHandler?.setter(
          Math.round((this.loadedCount * 100) / this.loaders.length)
        )
      }
    })
  }

  public async loadDataAsync(dispatch: AppDispatch) {
    if ((getAPIKey()?.length ?? 0) === 0) {
      const key = await this.api.getNewAPIKey('nokey')
      if (key.failureReason) {
        throw new Error(key.failureReason)
      }
      setAPIKey(key.key?.toString() ?? '')
      this.api.resetConfig()
    }
    this.loadedCount = 1
    this.setLoadees(dispatch, this.api)
    this.loaders.forEach((x) => x())
  }
}
