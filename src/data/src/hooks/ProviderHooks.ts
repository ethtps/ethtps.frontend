import { useGetSidechainsIncludedFromAppStore } from './LiveDataHooks'
import { useAppSelector, AppState } from '../store'
import { ProviderResponseModel } from '../../../api-client/src/models/ProviderResponseModel'

export function useGetProvidersFromAppStore() {
	const sidechainsIncluded = useGetSidechainsIncludedFromAppStore()
	return useAppSelector((state: AppState) =>
		state.providers.filter((x) =>
			sidechainsIncluded ? x : x.type !== 'Sidechain'
		) as ProviderResponseModel[]
	)
}
