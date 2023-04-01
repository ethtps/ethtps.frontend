import { DataResponseModel } from '../../../api-client/src/models/DataResponseModel';
import { DataPoint } from '../../../api-client/src/models/DataPoint';


export type GenericDictionary<T> = { [key: string]: T }
export type DataPointDictionary = GenericDictionary<DataPoint>
export type DataResponseModelDictionary = GenericDictionary<DataResponseModel[]>
export type InstantDataResponseModel =
	GenericDictionary<DataResponseModelDictionary>
export type StringDictionary = GenericDictionary<string>
export type AnyDictionary = GenericDictionary<any>
