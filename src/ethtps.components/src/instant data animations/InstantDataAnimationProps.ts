import { ETHTPSDataCoreDataType, ETHTPSDataCoreModelsResponseModelsProviderResponseModel } from 'ethtps.api'
import { XYDimensions } from '../../'
import { ExtendedTimeInterval, GenericDictionary, L2DataUpdateModel } from '../../../ethtps.data/src'

export interface IInstantDataAnimationProps extends
    ETHTPSAnimation {
    providerData?: ETHTPSDataCoreModelsResponseModelsProviderResponseModel[]
    showSidechains: boolean
    timeInterval?: ExtendedTimeInterval
}

export type ETHTPSAnimation = DataAnimationProps<ETHTPSDataCoreDataType, L2DataUpdateModel> & XYDimensions

export type DataAnimationProps<TDataType, TNewestData> = Animation & {
    dataType: TDataType
    newestData?: GenericDictionary<TNewestData>
    maxEntries: number
}

export type Animation = {
    connected: boolean
    duration: number
    refreshInterval: number
    paused: boolean
    isLeaving?: boolean
}
