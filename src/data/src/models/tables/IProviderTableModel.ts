import { L2DataUpdateModel, LiveDataAggregator } from '..'
import { DataType, ProviderResponseModel } from '../../../../api-client'
import { IMaxDataModel } from '../interfaces'
import { ICellClickedEvent } from './ICellClickedEvent'
import { IMaxRowsModel } from './IMaxRowsModel'

export interface IProviderTableModel extends ICellClickedEvent, IMaxRowsModel {
	providerData: ProviderResponseModel[] | null | undefined
	maxData: IMaxDataModel
	aggregator: LiveDataAggregator,
	dataType: DataType,
	width: number
	selectedProvider: string
	providerRowHovered: (providerName: string) => void
}
