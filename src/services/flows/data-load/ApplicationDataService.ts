import { ETHTPSApi } from '@/services/api/ETHTPSAPI'
import { IOptionalCallback } from '../../../data/src/models/charts/handlers/IOptionalCallback'
import { QueryClient } from 'react-query'
import { setNetworks } from '@/data/src/slices/NetworksSlice'
import { setAPIKey } from '@/services/DependenciesIOC'
import { AppDispatch } from '../../../data/src/store'
import { setProviderColorDictionary } from '@/data/src/slices/ColorSlice'

type Loadee<T> = {
  loaded: boolean
  name: string
  getter: (api: ETHTPSApi) => Promise<T>
  setter: (dispatch: AppDispatch, value: T) => void
}

export class ApplicationDataService {
  private loaders = [() => {}]
  private loadedCount = 0
  constructor(
    private api: ETHTPSApi,
    private queryClient: QueryClient,
    private progressChanged?: IOptionalCallback<number>
  ) {}

  private setLoadees(dispatch: AppDispatch, api: ETHTPSApi) {
    this.addLoadee<Array<string>>(
      'networks',
      async (api) => await api.getNetworksAsync(),
      (v) => dispatch(setNetworks(v))
    )
    this.addLoadee(
      'provider-color-dictionary',
      async (api) => await api.getProviderColorDictionary(),
      (v) => dispatch(setProviderColorDictionary(v))
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
        async () => await getter(this.api)
      )
      setter(data)
      this.loadedCount++
      if (this.progressChanged?.callback) {
        this.progressChanged?.callback(
          Math.round((this.loadedCount * 100) / this.loaders.length)
        )
      }
    })
  }

  public async loadDataAsync(dispatch: AppDispatch) {
    const key = await this.api.getNewAPIKey('nokey')
    if (key.failureReason) {
      throw new Error(key.failureReason)
    }
    setAPIKey(key.key?.toString() ?? '')
    this.api.resetConfig()
    this.loadedCount = 0
    this.setLoadees(dispatch, this.api)
    this.loaders.forEach((x) => x())
  }
}
