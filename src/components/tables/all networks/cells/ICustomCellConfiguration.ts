import { ProviderResponseModel } from '@/api-client'
import { ICellClickedEvent } from './ICellClickedEvent'

export const buildClassNames = (config: ICustomCellConfiguration) => {
  return {
    className: ` ${config.clickCallback !== undefined ? 'pointable' : ''}`
  }
}

export interface ICustomCellConfiguration extends ICellClickedEvent {
  provider?: ProviderResponseModel
}
