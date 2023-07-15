import {
	ETHTPSDataCoreDataType,
	ETHTPSDataCoreModelsResponseModelsProviderResponseModel,
	ETHTPSDataCoreTimeInterval,
} from 'ethtps.api'

import { DependencyList, EffectCallback, useEffect, useState } from 'react'
import {
	DataResponseModelDictionary,
	FrequencyLimiter,
	MinimalDataPoint,
	dataTypeToString,
	extractData,
	getModeData,
	setEffectDetails,
	useAppSelector,
	useGetLiveDataFromAppStore,
	useGetLiveDataModeFromAppStore,
	useGetLiveDataSmoothingFromAppStore,
	useGetProviderColorDictionaryFromAppStore,
	useGetProvidersFromAppStore,
	useGetSidechainsIncludedFromAppStore,
} from '../../../ethtps.data/src'
import { LiveDataPoint } from './types'

export type InstantBarChartDataset = {
	label: string
	data: [number]
	borderColor: string
	backgroundColor: string
}

export type InstantBarChartData = {
	labels: [string]
	datasets: InstantBarChartDataset[]
}

export type LiveDataPoint2 = {
	providerName: string
	providerColor: string
	value: number
}

export type LiveData = {
	mode: string
	total: number
	data: LiveDataPoint2[]
	sidechainsIncluded: boolean
}

export const createDataPoint = (
	data: DataResponseModelDictionary,
	provider: ETHTPSDataCoreModelsResponseModelsProviderResponseModel,
	color: string
) => {
	let value = extractData(data, provider.name as string)
	return {
		providerName: provider.name,
		providerColor: color,
		value,
	} as LiveDataPoint2
}

export function useGet1mTPS() {
	return useAppSelector((state) => state.liveData.oneMinuteTPSData)
}

export function useGet1mGPS() {
	return useAppSelector((state) => state.liveData.oneMinuteGPSData)
}

export function useGet1mGTPS() {
	return useAppSelector((state) => state.liveData.oneMinuteGTPSData)
}
export type LiveDataState = {
	smoothing: ETHTPSDataCoreTimeInterval
	sidechainsIncluded: boolean
	mode: ETHTPSDataCoreDataType
}

export function useLiveDataState(): LiveDataState {
	const smoothing = useGetLiveDataSmoothingFromAppStore()
	const sidechainsIncluded = useGetSidechainsIncludedFromAppStore()
	const mode = useGetLiveDataModeFromAppStore()
	return { smoothing, sidechainsIncluded, mode }
}

export function useStreamchartData(interval: string) {
	/*
  const sidechainsIncluded = useGetSidechainsIncludedFromAppStore()
  const { data, status, refetch } = useQuery("get streamchart data", () =>
	api.getStreamChartData({
	  interval: ETHTPSDataCoreTimeIntervalFromJSON(`"${interval}"`),
	  includeSidechains: sidechainsIncluded,
	}),
  )
  useEffect(() => {
	refetch()
  }, [sidechainsIncluded])*/
	//return { data, status }
}

export function useLiveData() {
	const providers: ETHTPSDataCoreModelsResponseModelsProviderResponseModel[] =
		useGetProvidersFromAppStore()
	const smoothing = useGetLiveDataSmoothingFromAppStore()
	const colors = useGetProviderColorDictionaryFromAppStore()
	const sidechainsIncluded = useGetSidechainsIncludedFromAppStore()
	const mode = useGetLiveDataModeFromAppStore()
	const liveData = useGetLiveDataFromAppStore()
	const [data, setData] = useState<DataResponseModelDictionary>()
	const [processedData, setProcessedData] = useState<LiveData>()
	useEffect(() => {
		if (liveData) {
			setData(getModeData(liveData, mode))
		}
	}, [mode, liveData, sidechainsIncluded])
	useEffect(() => {
		if (data && colors) {
			let d_possiblyUndefined = providers
				.map((provider) =>
					createDataPoint(data, provider, provider.color as string)
				)
				.filter((x) => x !== undefined)
				.map((x) => x as LiveDataPoint2)
			if (
				d_possiblyUndefined !== undefined &&
				d_possiblyUndefined?.length > 0
			) {
				let total = d_possiblyUndefined
					.map((x) => x?.value)
					.reduce(
						(a: number, b: number) => (a as number) + (b as number)
					)
				setProcessedData({
					data: d_possiblyUndefined,
					total,
					mode: dataTypeToString(mode),
					sidechainsIncluded,
				})
			}
		}
	}, [mode, smoothing, data, colors, providers, sidechainsIncluded])
	return processedData
}

export const dataExtractor = (data: MinimalDataPoint | undefined, dataType: ETHTPSDataCoreDataType | undefined) => {
	if (!data || !dataType) return undefined
	switch (dataType) {
		case ETHTPSDataCoreDataType.TPS:
			return data.tps
		case ETHTPSDataCoreDataType.GPS:
			return data.gps
		default:
			return (data?.gps ?? 0) / 21000
	}
}

export const liveDataPointExtractor = (data: LiveDataPoint | undefined, dataType: ETHTPSDataCoreDataType | undefined) => {
	return dataExtractor(data?.y, dataType)
}

export const minimalDataPointToLiveDataPoint = (data: MinimalDataPoint | undefined, z: string): LiveDataPoint => {
	return {
		x: (new Date()).getTime(),
		y: {
			tps: data?.tps ?? 0,
			gps: data?.gps ?? 0,
			gtps: data?.gps ? data.gps / 21000 : 0,
		},
		z: z
	}
}

export function useMeasuredEffect(effect: EffectCallback, deps?: DependencyList | undefined) {
	const [time, setTime] = useState(0)
	useEffect(() => {
		const now = Date.now()
		try {
			effect()
		}
		finally {
			setTime(Date.now() - now)
		}
	}, deps)
	return time
}

export function useDebugMeasuredEffect(effect: EffectCallback, effectName: string, deps?: DependencyList | undefined) {
	const willRun = FrequencyLimiter.willExecute(effectName)
	const time = useMeasuredEffect(effect, deps)
	if (willRun && time > 0) setEffectDetails({
		timeMs: time,
		name: effectName
	})
}
