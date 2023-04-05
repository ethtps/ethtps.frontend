import { ETHTPSApi } from "@/services/api/ETHTPSAPI"
import { QueryClient } from "react-query"

export async function getAsync<T>(
    name: string,
    getter: (api: ETHTPSApi) => Promise<T>,
    api: ETHTPSApi,
    queryClient: QueryClient
  ) {
        return await queryClient.fetchQuery(
            name,
            async () => await getter(api),
            {
                retry: true,
                retryDelay: 2500
            }
        )
    
}