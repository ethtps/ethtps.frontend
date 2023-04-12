import { DataType } from '../../../api-client/src/models/DataType'
import { setIncludeSidechains, setLiveDataType } from '../slices/LiveDataSlice'
import { websocketActions } from '../slices/WebsocketSubscriptionSlice'
import { AppState, useAppDispatch, useAppSelector } from '../store'
import { TimeInterval } from '../../../api-client/src/models/TimeInterval'
import { InstantDataResponseModel } from 'src/common-types/Dictionaries'

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
	useAppDispatch(websocketActions.connecting())
}

export function useGetSidechainsIncludedFromAppStore() {
	return useAppSelector((state: AppState) => state.liveData.includeSidechains) as boolean
}

export function useSetSidechainsIncluded(value: boolean) {
	useAppDispatch(setIncludeSidechains(value))
}
