import { ProviderResponseModel } from '../../../../api-client'
import { IMaxDataModel } from '../interfaces'
import { ICellClickedEvent } from './ICellClickedEvent'
import { IMaxRowsModel } from './IMaxRowsModel'

export interface IProviderTableModel extends ICellClickedEvent, IMaxRowsModel {
	providerData?: ProviderResponseModel[] | null
	maxData?: IMaxDataModel
	width?: number
	selectedProvider?: string
	providerRowHovered?: (providerName?: string) => void
}
