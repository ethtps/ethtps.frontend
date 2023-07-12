import { Dictionary } from '@reduxjs/toolkit'
import { ETHTPSDataCoreDataType, ETHTPSDataCoreModelsResponseModelsProviderResponseModel } from 'ethtps.api'
import { ExtendedTimeInterval, L2DataUpdateModel } from '../../../ethtps.data/src'

export interface InstantDataAnimationProps {
    width?: number
    height?: number
    dataType: ETHTPSDataCoreDataType
    newestData?: Dictionary<L2DataUpdateModel>
    connected: boolean
    providerData?: ETHTPSDataCoreModelsResponseModelsProviderResponseModel[]
    maxEntries: number
    duration: number
    refreshInterval: number
    showSidechains: boolean
    paused: boolean
    isLeaving?: boolean
    verticalPadding?: number
    horizontalPadding?: number
    timeInterval?: ExtendedTimeInterval
}