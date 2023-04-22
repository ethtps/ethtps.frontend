import { QueryClient } from 'react-query'
import { LocalStorageService } from './LocalStorageService'
import { ETHTPSApi } from './api'

var _api_key: string | undefined | null = ''
export const apiURL = 'http://localhost:10202'

export const storage: LocalStorageService = new LocalStorageService()
export const api = new ETHTPSApi(
  (process.env.REACT_APP_API_DEV_GENERAL_ENDPOINT as string) ?? apiURL,
  process.env.REACT_APP_FRONTEND_API_KEY ?? 'rXRBBrUKkW3WAWLqAsO6lCVJUbOBM8Dntc9BIJRYo6dGwRpSkyGiSpX3OxDhLFKW'
)

//export const websocketsService = new WebsocketsService()


const defaultQueryConfig = {
  refetchOnWindowFocus: false,
  retry: true,
  retryDelay: 2500,
  staleTime: 1000 * 60 * 5,
  queryKey: 'providers',
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      ...defaultQueryConfig
    }
  }
})