import {
	ETHTPSDataCoreModelsDataPointsDataPoint,
	ETHTPSDataCoreModelsDataPointsDataResponseModel,
} from 'ethtps.api'

/**
 * A generic dictionary with a string key
 */
export type GenericDictionary<T> = { [key: string]: T }
export type DataPointDictionary =
	GenericDictionary<ETHTPSDataCoreModelsDataPointsDataPoint>
export type DataResponseModelDictionary = GenericDictionary<
	ETHTPSDataCoreModelsDataPointsDataResponseModel[]
>
export type InstantDataResponseModel =
	GenericDictionary<DataResponseModelDictionary>
export type StringDictionary = GenericDictionary<string>
export type AnyDictionary = GenericDictionary<any>

export function clone<T>(obj: GenericDictionary<T>) {
	let result = {}
	for (let key of Object.keys(obj)) {
		result = Object.assign(result, { [key]: obj[key] })
	}
	return result as GenericDictionary<T>
}

export function flatten<T>(obj: GenericDictionary<T>) {
	let result = new Array<T>()
	for (let key of Object.keys(obj)) {
		result.push(obj[key])
	}
	return result
}