
import { Configuration as AdminAPIConfiguration, AdminApi as ConfigurationAPI, ETHTPSConfigurationDatabaseAllConfigurationStringsModel, ProviderTypesApi, ProvidersApi } from 'ethtps.admin.api'
import { Configuration as APIConfiguration, ExperimentApi, ExternalWebsiteCategoriesApi, ExternalWebsitesApi, GeneralApi, ProviderLinksApi } from 'ethtps.api'
import { APIKeyMiddleware } from '.'

const API_URL = "http://localhost:10202"
const ADMIN_URL = "http://localhost:33018"

const throwException = async (response: Response) => {
    throw new Error(`Error ${response.status}: ${response.statusText}`)
}


const throwExceptionIfNotOk = async (response: Response) => {
    const res = await response
    if (res.status < 200 || res.status >= 400) {
        await throwException(res)
    }
    return res
}

export class AdminAPIWrapper {

    public static DEFAULT =
        new AdminAPIWrapper(
            ADMIN_URL,
            (typeof window === 'undefined') ?
                (process.env.REACT_APP_FRONTEND_API_KEY ?? '')
                : localStorage?.getItem('apiKey') ?? '',
            API_URL,
            (typeof window === 'undefined') ?
                (process.env.REACT_APP_FRONTEND_API_KEY ?? '')
                : localStorage?.getItem('apiKey') ?? '')

    private _experimentAPI = new ExperimentApi()
    private providersAPI = new ProvidersApi()
    private _externalWebsiteCategoriesAPI = new ExternalWebsiteCategoriesApi()
    private _externalWebsitesAPI = new ExternalWebsitesApi()
    private _providerLinksAPI = new ProviderLinksApi()
    private _providerTypesAPI = new ProviderTypesApi()
    private _configurationAPI = new ConfigurationAPI()
    private _generalAPI = new GeneralApi();
    private _adminAPIURL: string
    private _generalAPIKey: string = ''
    private _generalAPIURL: string
    private _adminAPIKey: string = ''

    private _genAPIConfig(url: string) {
        let config = new APIConfiguration({
            basePath: url,
            middleware: [new APIKeyMiddleware(this._generalAPIKey)]
        })

        return config
    }

    private _genAdminAPIConfig(url: string) {
        let config = new AdminAPIConfiguration({
            basePath: url,
            middleware: [new APIKeyMiddleware(this._adminAPIKey)]
        })

        return config
    }

    constructor(adminAPIURL: string = ADMIN_URL,
        _adminAPIKey: string,
        _generalAPIURL: string = API_URL,
        _generalAPIKey: string) {
        this._adminAPIURL = adminAPIURL
        this._adminAPIKey = _adminAPIKey
        this._generalAPIKey = _generalAPIKey
        this._generalAPIURL = _generalAPIURL
        this.resetConfig()
    }

    public resetConfig() {
        this._experimentAPI = new ExperimentApi(this._genAPIConfig(this._generalAPIURL))
        this.providersAPI = new ProvidersApi(this._genAdminAPIConfig(this._adminAPIURL))
        this._externalWebsiteCategoriesAPI = new ExternalWebsiteCategoriesApi(this._genAPIConfig(this._generalAPIURL))
        this._externalWebsitesAPI = new ExternalWebsitesApi(this._genAPIConfig(this._generalAPIURL))
        this._providerLinksAPI = new ProviderLinksApi(this._genAPIConfig(this._generalAPIURL))
        this._configurationAPI = new ConfigurationAPI(this._genAdminAPIConfig(this._adminAPIURL))
        this._providerTypesAPI = new ProviderTypesApi(this._genAdminAPIConfig(this._adminAPIURL))
    }

    public async addOrUpdateStringAsync(model: ETHTPSConfigurationDatabaseAllConfigurationStringsModel, environment?: string, microservice?: string) {
        return await this._configurationAPI.apiV3AdminAddOrUpdateConfigurationStringPut({
            microservice: microservice,
            environment: environment,
            eTHTPSConfigurationConfigurationStringUpdateModel: {
                ...model
            }
        })
    }

    public async getAllProvidersAsync() {
        return await this.providersAPI.apiV3DataProvidersGetAllGet()
    }

    public async getAllStringsAsync() {
        return await this._configurationAPI.apiV3AdminGetAllConfigurationStringsGet()
    }

    public async linkStringToProviderByIDAsync(stringID: number, providerID: number, environment?: string) {
        return await this._configurationAPI.apiV3AdminLinkProviderToConfigurationStringByIDPut({
            configurationStringID: stringID,
            providerID: providerID,
            environmentName: environment
        })
    }

    public async unlinkStringFromProviderByIDAsync(stringID: number, providerID: number, environment?: string) {
        return await this._configurationAPI.apiV3AdminUnlinkProviderFromConfigurationStringDelete({
            configurationStringID: stringID,
            providerID: providerID,
            environmentName: environment
        })
    }

    public async clearHangfireQueueAsync() {
        return await this._configurationAPI.apiV3AdminClearHangfireQueueDelete()
    }

    public async enableAllDataUpdatersAsync() {
        return await this._configurationAPI.apiV3AdminEnableAllDataProvidersPost()
    }

    public async getAllEnvironmentsAsync() {
        return await this._configurationAPI.apiV3AdminGetAllEnvironmentsGet()
    }

    public async getAllNetworksAsync() {
        return await this._generalAPI.apiV2NetworksGet()
    }

    public async getAllExperimentsAsync() {
        return await this._experimentAPI.apiV3ExperimentsGetAvailableExperimentsGet()
    }
    public async getExperimentAsync(id: number) {
        return await this._experimentAPI.apiV3ExperimentsGetExperimentGet({ id: id })
    }
    public async getAllConfigurationStringLinksForAsync(configurationStringID: number) {
        return await this._configurationAPI.apiV3AdminGetAllConfigurationStringLinksGet({ configurationStringID: configurationStringID })
    }

    public async getAllMicroservicesAsync() {
        return await this._configurationAPI.apiV3AdminGetAllMicroservicesGet()
    }

    public async getAllProviderTypesAsync() {
        return await this._providerTypesAPI.apiV3DataProviderTypesGetAllGet()
    }

    public async getAllProviderLinksAsync() {
        return await this._providerLinksAPI.apiV3ProviderLinksGetAllGet()
    }

    public async getAllExternalWebsiteCategoriesAsync() {
        return await this._externalWebsiteCategoriesAPI.apiV3ExternalWebsiteCategoriesGetAllGet()
    }

    public async getAllExternalWebsitesAsync() {
        return await this._externalWebsitesAPI.apiV3ExternalWebsitesGetAllGet()
    }

    public async createProviderLinkAsync(providerID: number, link: string, environment?: string) {
        return await this._providerLinksAPI.apiV3ProviderLinksCreatePost({
            eTHTPSDataIntegrationsMSSQLProviderLink: {
                providerId: providerID,
                link: link
            }
        })
    }
}