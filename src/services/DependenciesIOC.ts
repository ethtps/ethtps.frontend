import { QueryClient } from 'react-query'
import { LocalStorageService } from './LocalStorageService'
import { ETHTPSApi } from './api'

var _api_key: string | undefined | null = ''
export const apiURL = 'http://localhost:10202'

export const storage: LocalStorageService = new LocalStorageService()
export const api = new ETHTPSApi(
  (process.env.REACT_APP_API_DEV_GENERAL_ENDPOINT as string) ?? apiURL
)

//export const websocketsService = new WebsocketsService()

export function getAPIKey() {
  return 'rXRBBrUKkW3WAWLqAsO6lCVJUbOBM8Dntc9BIJRYo6dGwRpSkyGiSpX3OxDhLFKW'
  if (_api_key === null || _api_key === undefined)
    tryLoadAPIKeyFromLocalStorage()
  return _api_key
}

export function setAPIKey(value: string) {
  try {
    localStorage.setItem('XAPIKey', value)
    console.log(`Got new API key: ${value}`)
  } catch {
    console.log('Local storage disabled')
  } finally {
    _api_key = value
  }
}

export function tryLoadAPIKeyFromLocalStorage() {
  try {
    _api_key = localStorage.getItem('XAPIKey')
  } catch {
    console.log('Local storage disabled')
  }
}

export const websocketServiceURL =
  'ws://localhost:2000/LiveData?XAPIKEY=' + getAPIKey()

export const queryClient = new QueryClient()
