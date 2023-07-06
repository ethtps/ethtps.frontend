import { ETHTPSDataCoreModelsResponseModelsProviderResponseModel } from 'ethtps.api'
import { AppState, useAppSelector } from '../store'
import { useGetSidechainsIncludedFromAppStore } from './LiveDataHooks'

export function useGetProvidersFromAppStore() {
	const sidechainsIncluded = useGetSidechainsIncludedFromAppStore()
	return useAppSelector((state: AppState) =>
		state.providers.filter((x) =>
			sidechainsIncluded ? x : x.type !== 'Sidechain'
		)
	) as ETHTPSDataCoreModelsResponseModelsProviderResponseModel[]
}
