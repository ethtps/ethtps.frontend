import {
	ETHTPSDataCoreDataType,
	ETHTPSDataCoreModelsResponseModelsProviderResponseModel,
	ETHTPSDataCoreTimeInterval,
} from 'ethtps.api'

import { useAnimate, useSpring as useMotionSpring, useTransform } from 'framer-motion'
import { DependencyList, useCallback, useEffect, useState } from 'react'
import {
	DataResponseModelDictionary,
	DebugBehaviors,
	FrequencyLimiter,
	LiveDataPoint,
	MinimalDataPoint,
	dataTypeToString,
	extractData,
	getModeData,
	useAppSelector,
	useGetLiveDataFromAppStore,
	useGetLiveDataModeFromAppStore,
	useGetLiveDataSmoothingFromAppStore,
	useGetProviderColorDictionaryFromAppStore,
	useGetProvidersFromAppStore,
	useGetSidechainsIncludedFromAppStore
} from '../../../ethtps.data/src'
import { LinScale } from './d3-custom'

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

export type AutoScrollingParameters = {
	paused?: boolean | undefined
	xAxis: LinScale
	width: number
}

function calculateSpeed(range: [number, number] | number[], width: number) {
	return 10/*
	const dr = range[1] - range[0]
	return (dr / width) * 1000*/
}

function useAutoScrolling({ paused, xAxis, width }: AutoScrollingParameters) {
	const [speed, setSpeed] = useState(() => calculateSpeed(xAxis.range(), width))
	useEffect(() => {
		if (!!paused) {
			setSpeed(0)
			return
		}
		setSpeed(calculateSpeed(xAxis.range(), width))
	}, [paused, xAxis, width])
	return speed
}

export function useChartTranslations({ paused, xAxis, width }: AutoScrollingParameters) {
	const speed = useAutoScrolling({ paused, xAxis, width })
	const translateX = useMotionSpring(0, { stiffness: 1000, damping: 100, restSpeed: 1, restDelta: 1, velocity: speed })
	const translateY = useMotionSpring(0, { stiffness: 1000, damping: 1000, })
	const negTranslateY = useTransform(translateY, v => -v)
	const negTranslateX = useTransform(translateX, v => -v)
	return { translateX, translateY, negTranslateY, negTranslateX }
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

export const liveDataPointExtractor = (data: Partial<LiveDataPoint> | undefined, dataType: ETHTPSDataCoreDataType | undefined) => {
	return dataExtractor(data?.y, dataType)
}

export const minimalDataPointToLiveDataPoint = (data: MinimalDataPoint | undefined, z: string): LiveDataPoint => {
	const res = new LiveDataPoint()
	res.x = (new Date()).getTime()
	res.tps = data?.tps ?? 0
	res.gps = data?.gps ?? 0
	res.z = z
	return res
}

export function useMeasuredEffect(effect: () => void, deps?: DependencyList | undefined, frequencyLimit: boolean = true, effectName?: string) {
	const executeImmediately = FrequencyLimiter.canExecute(effectName ?? 'effect')
	let time = 0
	const now = performance.now()
	useEffect(() => {
		if (executeImmediately) effect()
		else FrequencyLimiter.debounce(effectName ?? 'effect', effect)
	}, deps)
	time = (performance.now() - now)
	/*
	useEffect(() => {
		const now = Date.now()
		try {
			return effect()
		}
		catch (e) {
			console.error(e)
		}
		finally {
			setTime(Date.now() - now)
		}
	}, deps)*/
	return time
}

export function useDebugMeasuredEffect(effect: () => void, effectName: string, deps?: DependencyList | undefined, frequencyLimit: boolean = true) {
	return useGroupedDebugMeasuredEffect(effect, effectName, undefined, deps, frequencyLimit)
}

export function useGroupedDebugMeasuredEffect(effect: () => void, effectName: string, groupName?: string, deps?: DependencyList | undefined, frequencyLimit: boolean = true) {
	const willExecute = FrequencyLimiter.willExecute(effectName)
	const time = useMeasuredEffect(effect, deps, frequencyLimit, `${groupName ?? 'default'}-${effectName}}`)
	const debug = useAppSelector(state => state.debugging)
	if (debug.enabled && willExecute)
		DebugBehaviors.effectBehavior.add?.({
			timeMs: time,
			group: groupName,
			name: effectName
		})
}

/**
 * Measures the time it takes for an effect to execute and adds it to the debug store.
 * @param effect The effect to measure, provided as a function.
 * @param effectName
 * @param groupName
 * @param deps Not used, but provided so that the method can be easily used in a useEffect debug hook.
 */
export function measure(effect: () => void, effectName: string, groupName?: string, deps?: DependencyList | undefined) {
	const willExecute = FrequencyLimiter.willExecute(effectName)
	const now = performance.now()
	effect()
	const time = performance.now() - now
	const debug = useAppSelector(state => state.debugging)
	if (debug.enabled && willExecute) {
		DebugBehaviors.effectBehavior.add?.({
			timeMs: time,
			group: groupName,
			name: effectName
		})
	}
}

export function useChartTooltip() {
	const providerHovered = useCallback((provider: ETHTPSDataCoreModelsResponseModelsProviderResponseModel | undefined) => {
	}, [])
}