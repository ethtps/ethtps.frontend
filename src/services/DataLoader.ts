/* eslint-disable import/no-internal-modules */
import 'server-only'
import { QueryClient } from 'react-query'
import { ProviderResponseModel } from '../api-client'
import { cache } from 'react'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: true,
            retryDelay: 2500,
            staleTime: 1000 * 60 * 5,
            queryKey: 'providers',
        }
    }
})

export const preload = () => {
    void getProvidersAsync(queryClient)
}

let providers: ProviderResponseModel[] | undefined

export const getProviders = cache(async () => {
    return await getProvidersAsync(queryClient)
})

async function getProvidersAsync(queryClient: QueryClient) {
    // Define response and providers variables
    let response: Response | undefined

    // Retry up to 10 times
    let retryCount = 0
    if (!providers)
        do {
            try {
                // Try to fetch the providers
                response = await queryClient.fetchQuery('providers', async () => await fetch(`${process.env.REACT_APP_API_DEV_GENERAL_ENDPOINT}/api/v2/Providers?includeSidechains=true&XAPIKey=${process.env.REACT_APP_FRONTEND_API_KEY}`), {
                    retry: true,
                    cacheTime: 1000 * 60,
                    retryDelay: 200 //It's only us that are hitting the backend, no need to worry about overloading it (famous last words)
                })
                providers = JSON.parse(await response?.text() ?? '[]')
            }
            catch {
            }
        }
        while (++retryCount <= 10 && (!providers || providers.length === 0))

    // Return the providers
    return providers
}
