import { ProviderModel } from '@/data'

export interface ICellClickedEvent {
  clickCallback?: (provider?: ProviderModel, cellName?: string) => void
}
