
import { useContext } from 'react'
import { useLoadedObject } from '..'
import { APIContext } from '../../../..'

export function useAllProviders() {
    const api = useContext(APIContext)
    return useLoadedObject(() => api.getAllProvidersAsync())
}

export function useProviderTypes() {
    const api = useContext(APIContext)
    return useLoadedObject(() => api.getAllProviderTypesAsync())
}