import { ETHTPSConfigurationConfigurationStringLinksModel, ETHTPSConfigurationDatabaseConfigurationString, ETHTPSConfigurationDatabaseEnvironment, ETHTPSConfigurationIMicroservice, ETHTPSDataIntegrationsMSSQLProvider } from 'ethtps.admin.api'

export interface IConfigurationStringLinksEditorProps {
    model: ETHTPSConfigurationConfigurationStringLinksModel
    providers?: ETHTPSDataIntegrationsMSSQLProvider[]
    environments?: ETHTPSConfigurationDatabaseEnvironment[]
    microservices?: ETHTPSConfigurationIMicroservice[]
    onClicked?: (microservice: ETHTPSConfigurationIMicroservice) => void
    onProviderClicked?: (provider: ETHTPSDataIntegrationsMSSQLProvider) => void
    saving?: boolean
    onSave?: (data: ETHTPSConfigurationDatabaseConfigurationString) => void
    saveResult?: JSX.Element
    providerSaveResult?: JSX.Element
}