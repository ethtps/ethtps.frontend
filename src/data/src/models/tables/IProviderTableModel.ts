import { LiveDataAggregator } from '..'
import { DataType, ProviderResponseModel } from '../../../../api-client'
import { IDataModel } from '../interfaces'
import { ICellClickedEvent } from './ICellClickedEvent'
import { IMaxRowsModel } from './IMaxRowsModel'

export interface IProviderTableModel extends ICellClickedEvent, IMaxRowsModel {
	providerData: ProviderResponseModel[] | null | undefined
	maxData: IDataModel
	instantData: IDataModel,
	aggregator: LiveDataAggregator,
	dataType: DataType,
	width: number
	selectedProvider: string
	showSidechains: boolean
	providerRowHovered: (providerName: string) => void
}
