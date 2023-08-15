export interface ProviderEnvironment {
    provider: string
    environment: string
}

export interface MicroserviceEnvironment {
    microservice: string
    environment: string
}

export interface IConfigurationString {
    id: number
    name: string
    value: string
    isSecret: boolean
    isEncrypted: boolean
    encryptionAlgorithmOrHint?: string
}

export interface AllConfigurationStringsModel extends IConfigurationString {
    microserviceEnvironments?: Array<MicroserviceEnvironment>
    providerEnvironments?: Array<ProviderEnvironment>
}

const emp: AllConfigurationStringsModel = {
    id: NaN,
    name: '',
    value: '',
    isSecret: false,
    isEncrypted: false,
    microserviceEnvironments: []
}

export const getEmpty = (type: string) => {
    switch (type) {
        case 'AllConfigurationStringsModel':
            return emp
    }
}