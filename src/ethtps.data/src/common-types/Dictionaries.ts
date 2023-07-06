import { ETHTPSDataCoreModelsDataPointsDataPoint, ETHTPSDataCoreModelsDataPointsDataResponseModel } from 'ethtps.api'

export type GenericDictionary<T> = { [key: string]: T }
export type DataPointDictionary = GenericDictionary<ETHTPSDataCoreModelsDataPointsDataPoint>
export type DataResponseModelDictionary = GenericDictionary<ETHTPSDataCoreModelsDataPointsDataResponseModel[]>
export type InstantDataResponseModel =
	GenericDictionary<DataResponseModelDictionary>
export type StringDictionary = GenericDictionary<string>
export type AnyDictionary = GenericDictionary<any>
