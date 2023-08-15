import { useAPI, useLoadedObject } from '../../experiments'

export function useExternalWebsiteCategories() {
    const api = useAPI()
    return useLoadedObject(() => api.getAllExternalWebsiteCategoriesAsync())
}

export function useExternalWebsites() {
    const api = useAPI()
    return useLoadedObject(() => api.getAllExternalWebsitesAsync())
}