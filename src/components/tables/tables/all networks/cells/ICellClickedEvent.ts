import { ProviderModel } from '@/data/src'

export interface ICellClickedEvent {
  clickCallback?: (provider?: ProviderModel, cellName?: string) => void
}
