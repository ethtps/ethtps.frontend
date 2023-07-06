import { ETHTPSDataCoreDataType, ETHTPSDataCoreTimeInterval } from 'ethtps.api'
import {
	AppState,
	InstantDataResponseModel,
	setIncludeSidechains,
	setLiveDataType,
	useAppDispatch,
	useAppSelector,
} from '..'

export function useGetLiveDataModeFromAppStore() {
	return useAppSelector(
		(state: AppState) => state.liveData.liveDataType
	) as ETHTPSDataCoreDataType
}

export function useGetLiveDataSmoothingFromAppStore() {
	return useAppSelector(
		(state: AppState) => state.liveData.liveDataSmoothing
	) as ETHTPSDataCoreTimeInterval
}

export function useGetLiveDataFromAppStore() {
	return useAppSelector(
		(state: AppState) => state.liveData.data
	) as InstantDataResponseModel
}

export function useSetDataModeMutation(mode: ETHTPSDataCoreDataType) {
	useAppDispatch(setLiveDataType(mode))
}

export function useUpdateLiveData(updateRateMs: number) {
	//useAppDispatch(websocketActions.connecting())
}

export function useGetSidechainsIncludedFromAppStore() {
	return useAppSelector(
		(state: AppState) => state.liveData.includeSidechains
	) as boolean
}

export function useSetSidechainsIncluded(value: boolean) {
	useAppDispatch(setIncludeSidechains(value))
}
