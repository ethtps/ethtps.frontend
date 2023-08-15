import { ConfigurationString } from './ConfigurationString'

export interface Environment {
    // Define the properties of Environment based on your needs.
    // This is a placeholder as I don't have the exact structure.
    id: number
    name: string
}

export interface Microservice {
    // Define the properties of Microservice based on your needs.
    // This is a placeholder as I don't have the exact structure.
    id: number
    name: string
    description?: string
}

export interface Provider {
    // Define the properties of Provider based on your needs.
    // This is a placeholder as I don't have the exact structure.
    id: number
    name: string
}

export interface ProviderConfigurationString {
    id: number
    providerId: number
    configurationStringId: number
    environmentId: number
    configurationString?: ConfigurationString | null
    environment?: Environment | null
    provider?: Provider | null
}

export interface MicroserviceConfigurationString {
    id: number
    microserviceId: number
    configurationStringId: number
    environmentId: number
    configurationString?: ConfigurationString | null
    environment?: Environment | null
    microservice?: Microservice | null
}

export class ConfigurationStringLinksModel {
    configurationString: ConfigurationString
    providerLinks?: ProviderConfigurationString[] | null
    microserviceLinks?: MicroserviceConfigurationString[] | null

    constructor() {
        this.configurationString = { id: 0, name: "", value: "" }
        this.providerLinks = []
        this.microserviceLinks = []
    }
}
