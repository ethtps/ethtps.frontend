import { L2DataRequestModel, L2DataResponseModel } from '../../../../../api-client';
import { IRequestHandler } from './IRequestHandler'

export interface IL2DataRequestHandler
	extends IRequestHandler<L2DataRequestModel, L2DataResponseModel> { }
