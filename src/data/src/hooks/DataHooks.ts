
import { DataPointDictionary } from 'src/common-types/Dictionaries'
import { DataPoint } from '../../../api-client/src/models/DataPoint'
import { DataType } from '../../../api-client/src/models/DataType'
import { useAppSelector } from '../store'

export function useGetMaxDataFromAppStore() {
	return useAppSelector((state) => state.maxData)
}

export function useGetMaxDataForProviderFromAppStore(
	provider: string,
	type: DataType
) {
	return useAppSelector((state) =>
		state.maxData.getMaxDataFor(provider, type)
	) as DataPoint
}

export function useGetMaxTPSDataFromAppStore() {
	return useAppSelector((state) => state.maxData.maxTPSData) as DataPointDictionary
}

export function useGetMaxGPSDataFromAppStore() {
	return useAppSelector((state) => state.maxData.maxGPSData)as DataPointDictionary
}

export function useGetMaxGTPSDataFromAppStore() {
	return useAppSelector((state) => state.maxData.maxGTPSData)as DataPointDictionary
}

export function useGetNetworksFromAppStore() {
	return useAppSelector((state) => state.networks) as string[]
}
