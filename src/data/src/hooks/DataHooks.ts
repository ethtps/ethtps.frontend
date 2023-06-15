import {
	AppState,
	DataPointDictionary,
	IDataModel,
	getMaxDataFor,
	useAppSelector,
} from '..'
import { DataPoint, DataType } from '../../../api-client'

export function useGetMaxDataFromAppStore() {
	return useAppSelector((state: AppState) => state.maxData) as IDataModel
}

export function useGetMaxDataForProviderFromAppStore(
	provider: string,
	type: DataType
) {
	return useAppSelector((state: AppState) =>
		getMaxDataFor(state.maxData, provider, type)
	) as DataPoint
}

export function useGetMaxTPSDataFromAppStore() {
	return useAppSelector(
		(state: AppState) => state.maxData.tpsData
	) as DataPointDictionary
}

export function useGetMaxGPSDataFromAppStore() {
	return useAppSelector(
		(state: AppState) => state.maxData.gpsData
	) as DataPointDictionary
}

export function useGetMaxGTPSDataFromAppStore() {
	return useAppSelector(
		(state: AppState) => state.maxData.gtpsData
	) as DataPointDictionary
}

export function useGetNetworksFromAppStore() {
	return useAppSelector((state: AppState) => state.networks) as string[]
}
