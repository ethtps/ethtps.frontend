import { ETHTPSDataCoreDataType, ETHTPSDataCoreTimeInterval } from 'ethtps.api'
import {
	DataResponseModelDictionary,
	InstantDataResponseModel,
} from '../../common-types'

export interface ILiveDataModeModel {
	liveDataSmoothing: ETHTPSDataCoreTimeInterval
	liveDataType: ETHTPSDataCoreDataType
	includeSidechains: boolean
	data?: InstantDataResponseModel
	oneMinuteTPSData?: DataResponseModelDictionary
	oneMinuteGPSData?: DataResponseModelDictionary
	oneMinuteGTPSData?: DataResponseModelDictionary
	currentVisitors?: number
}
