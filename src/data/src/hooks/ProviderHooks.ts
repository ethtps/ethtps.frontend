import { useGetSidechainsIncludedFromAppStore } from './LiveDataHooks'
import { useAppSelector, AppState } from '../store'
import { ProviderResponseModel } from '../../../api-client'

export function useGetProvidersFromAppStore() {
	const sidechainsIncluded = useGetSidechainsIncludedFromAppStore()
	return useAppSelector((state: AppState) =>
		state.providers.filter((x) =>
			sidechainsIncluded ? x : x.type !== 'Sidechain'
		)
	) as ProviderResponseModel[]
}
