import { AppDispatch } from '@/data/src/store'
import { ETHTPSApi } from '@/services/api/ETHTPSAPI'

export type Loadee<T> = {
  loaded: boolean
  name: string
  getter: (api: ETHTPSApi) => Promise<T>
  setter: (dispatch: AppDispatch, value: T) => void
}
