
import { AppState, InstantDataResponseModel, setIncludeSidechains, setLiveDataType, useAppDispatch, useAppSelector } from '..'
import { DataType, TimeInterval } from '../../../api-client'

export function useGetLiveDataModeFromAppStore() {
	return useAppSelector((state: AppState) => state.liveData.liveDataType) as DataType
}

export function useGetLiveDataSmoothingFromAppStore() {
	return useAppSelector((state: AppState) => state.liveData.liveDataSmoothing) as TimeInterval
}

export function useGetLiveDataFromAppStore() {
	return useAppSelector((state: AppState) => state.liveData.data) as InstantDataResponseModel
}

export function useSetDataModeMutation(mode: DataType) {
	useAppDispatch(setLiveDataType(mode))
}

export function useUpdateLiveData(updateRateMs: number) {
	//useAppDispatch(websocketActions.connecting())
}

export function useGetSidechainsIncludedFromAppStore() {
	return useAppSelector((state: AppState) => state.liveData.includeSidechains) as boolean
}

export function useSetSidechainsIncluded(value: boolean) {
	useAppDispatch(setIncludeSidechains(value))
}
