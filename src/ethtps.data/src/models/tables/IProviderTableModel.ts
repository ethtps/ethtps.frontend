import {
	ETHTPSDataCoreDataType,
	ETHTPSDataCoreModelsResponseModelsProviderResponseModel,
} from 'ethtps.api'
import { LiveDataAggregator } from '..'
import { IDataModel } from '../interfaces'
import { ICellClickedEvent } from './ICellClickedEvent'
import { IMaxRowsModel } from './IMaxRowsModel'

export interface IProviderTableModel extends ICellClickedEvent, IMaxRowsModel {
	providerData:
		| ETHTPSDataCoreModelsResponseModelsProviderResponseModel[]
		| null
		| undefined
	maxData: IDataModel
	instantData: IDataModel
	aggregator: LiveDataAggregator
	dataType: ETHTPSDataCoreDataType
	width: number
	selectedProvider: string
	showSidechains: boolean
	providerRowHovered: (providerName: string) => void
}
