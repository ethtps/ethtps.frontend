import {
	AppState,
	DataPointDictionary,
	IMaxDataModel,
	getMaxDataFor,
	useAppSelector,
} from '..'
import { DataPoint, DataType } from '../../../api-client'

export function useGetMaxDataFromAppStore() {
	return useAppSelector((state: AppState) => state.maxData) as IMaxDataModel
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
		(state: AppState) => state.maxData.maxTPSData
	) as DataPointDictionary
}

export function useGetMaxGPSDataFromAppStore() {
	return useAppSelector(
		(state: AppState) => state.maxData.maxGPSData
	) as DataPointDictionary
}

export function useGetMaxGTPSDataFromAppStore() {
	return useAppSelector(
		(state: AppState) => state.maxData.maxGTPSData
	) as DataPointDictionary
}

export function useGetNetworksFromAppStore() {
	return useAppSelector((state: AppState) => state.networks) as string[]
}
