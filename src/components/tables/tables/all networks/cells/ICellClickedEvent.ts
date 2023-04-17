import { ProviderModel } from "@/api-client";


export interface ICellClickedEvent {
  clickCallback?: (provider?: ProviderModel, cellName?: string) => void
}
