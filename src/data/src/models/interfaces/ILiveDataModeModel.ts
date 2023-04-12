import { TimeInterval } from 'src'
import {
	InstantDataResponseModel,
	DataResponseModelDictionary,
} from '../../common-types/Dictionaries'
import { DataType } from '../../../../api-client/src/models/DataType'

export interface ILiveDataModeModel {
	liveDataSmoothing: TimeInterval
	liveDataType: DataType
	includeSidechains: boolean
	data?: InstantDataResponseModel
	oneMinuteTPSData?: DataResponseModelDictionary
	oneMinuteGPSData?: DataResponseModelDictionary
	oneMinuteGTPSData?: DataResponseModelDictionary
	currentVisitors?: number
}
