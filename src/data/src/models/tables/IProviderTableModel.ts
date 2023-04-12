import { ProviderResponseModel } from 'src'
import { IMaxDataModel } from '../interfaces/IMaxDataModel'
import { ICellClickedEvent } from './ICellClickedEvent'
import { IMaxRowsModel } from './IMaxRowsModel'

export interface IProviderTableModel extends ICellClickedEvent, IMaxRowsModel {
	providerData?: ProviderResponseModel[]
	maxData?: IMaxDataModel
	width: number
	selectedProvider?: string
	providerRowHovered?: (providerName?: string) => void
}
