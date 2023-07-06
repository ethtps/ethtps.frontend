import { ETHTPSDataCoreModelsQueriesDataRequestsL2DataRequestModel, ETHTPSDataCoreModelsResponseModelsL2sL2DataResponseModel } from 'ethtps.api'
import { IRequestHandler } from './IRequestHandler'

export interface IL2DataRequestHandler
	extends IRequestHandler<ETHTPSDataCoreModelsQueriesDataRequestsL2DataRequestModel, ETHTPSDataCoreModelsResponseModelsL2sL2DataResponseModel> { }
