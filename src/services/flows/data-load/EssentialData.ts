import { AppDispatch } from "@/data"
import { ETHTPSApi } from "@/services"

export type Loadee<T> = {
  loaded: boolean
  name: string
  getter: (api: ETHTPSApi) => Promise<T>
  setter: (dispatch: AppDispatch, value: T) => void
}
