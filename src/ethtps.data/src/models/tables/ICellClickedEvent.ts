import { ETHTPSDataCoreModelsDataPointsProviderModel } from 'ethtps.api'

export interface ICellClickedEvent {
	clickCallback?: (provider?: ETHTPSDataCoreModelsDataPointsProviderModel, cellName?: string) => void
}
