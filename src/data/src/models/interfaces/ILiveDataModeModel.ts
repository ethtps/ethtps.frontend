import {
	DataResponseModelDictionary,
	InstantDataResponseModel,
} from '../../common-types'
import { TimeInterval, DataType } from '../../../../api-client'

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
