import { QueryClient } from 'react-query'
import { ETHTPSApi } from '../ethtps.data/src'
import { LocalStorageService } from './LocalStorageService'

var _api_key: string | undefined | null = ''
export const apiURL = 'http://localhost:10202'

export const storage: LocalStorageService = new LocalStorageService()
export const api = new ETHTPSApi((process.env.REACT_APP_API_DEV_GENERAL_ENDPOINT as string) ?? apiURL, (typeof window === 'undefined') ? (process.env.REACT_APP_FRONTEND_API_KEY ?? '') : localStorage?.getItem('apiKey') ?? '')

//export const websocketsService = new WebsocketsService()

const defaultQueryConfig = {
  refetchOnWindowFocus: false,
  retry: true,
  retryDelay: 2500,
  staleTime: 1000 * 60 * 5,
  queryKey: 'providers'
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      ...defaultQueryConfig
    }
  }
})
