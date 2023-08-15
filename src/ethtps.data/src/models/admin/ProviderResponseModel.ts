export interface ProviderResponseModel {
    id: number
    name: string
    color: string
    theoreticalMaxTPS: number
    type: string
    isGeneralPurpose: boolean
    isSubchainOf: string
    status: IBasicLiveUpdaterStatus
}

export interface IBasicLiveUpdaterStatus {
    status: string
    isUnreliable: boolean
    isProbablyDown: boolean
}