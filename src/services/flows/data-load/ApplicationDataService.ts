import { ETHTPSApi } from '@/services/api/ETHTPSAPI'
import { IOptionalCallback } from '../../../data/src/models/charts/handlers/IOptionalCallback'
import { QueryClient } from 'react-query'
import { useAppState } from '@/services/data/Hooks'
import { useDispatch } from 'react-redux'
import { setNetworks } from '@/data/src/slices/NetworksSlice'
import { setAPIKey } from '@/services/DependenciesIOC'
import { error } from 'console'
import { queryClient } from '../../DependenciesIOC'
import { AppDispatch, RootState } from '../../../data/src/store'
import { AppState } from '@/data/src/store'

type Loadee<T> = {
  loaded: boolean
  name: string
  getter: (api: ETHTPSApi) => Promise<T>
  setter: (dispatch: AppDispatch, value: T) => void
}

export class ApplicationDataService {
  private loaders = [() => {}]
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
    })
  }

  public async loadDataAsync(dispatch: AppDispatch) {
    const key = await this.api.getNewAPIKey('nokey')
    if (key.failureReason) {
      throw new Error(key.failureReason)
    }
    setAPIKey(key.key?.toString() ?? '')
    this.api.resetConfig()
    this.setLoadees(dispatch, this.api)
    this.loaders.forEach((x) => x())
  }
}
