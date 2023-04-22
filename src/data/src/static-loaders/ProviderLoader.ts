import { QueryClient } from "react-query"
import { ProviderResponseModel } from "../../../api-client"

let providers: ProviderResponseModel[] | undefined

const loadProvidersAsync = async (queryClient: QueryClient) => {
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
                    retryDelay: 1000 //It's only us that are hitting the backend, no need to worry about overloading it (famous last words)
                })
                providers = JSON.parse(await response?.text() ?? "[]")
            }
            catch {
            }
        }
        while (providers === undefined && providers?.length === 0 && ++retryCount <= 10)

    // If the providers are empty, throw an error
    if (!providers || providers?.length === 0) {
        throw new Error("Couldn't load providers")
    }

    // Return the providers
    return providers
}

export { loadProvidersAsync }