import { ETHTPSDataCoreDataType } from 'ethtps.api'
import { IHandler } from '../../../../../ethtps.data/src'


export interface IDataModeButtonGroupConfiguration {
  modeHandle?: IHandler<ETHTPSDataCoreDataType>
  float?: 'left' | 'right'
}
