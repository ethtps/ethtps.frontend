import {
	APIKeyApi,
	ApiV3ChartDataGetStackedChartDataGetRequest,
	ApiV3ChartDataGetStreamchartDataGetRequest,
	ApiV3FeedbackReportIssuePostRequest,
	ApiV3FeedbackRequestNewL2PostRequest,
	ApiV3L2DataGetPostRequest,
	ChartDataApi,
	Configuration,
	ETHTPSDataCoreDataType,
	ETHTPSDataCoreTimeInterval,
	ExperimentApi,
	ExternalWebsiteCategoriesApi,
	ExternalWebsitesApi,
	FeedbackApi,
	GPSApi,
	GasAdjustedTPSApi,
	GeneralApi,
	L2DataApi,
	ProviderLinksApi,
	TPSApi,
} from 'ethtps.api'
import {
	DataPointDictionary,
	DataResponseModelDictionary,
	StringDictionary,
} from '../common-types'
import { APIKeyMiddleware } from './APIKeyMiddleware'

export class ETHTPSApi {
	public generalApi: GeneralApi = new GeneralApi()
	private _apiURL: string
	public tpsApi: TPSApi = new TPSApi()
	public gpsApi: GPSApi = new GPSApi()
	public l2DataApi: L2DataApi = new L2DataApi()
	public gtpsApi: GasAdjustedTPSApi = new GasAdjustedTPSApi()
	public experimentAPI: ExperimentApi = new ExperimentApi()
	public externalWebsitesAPI: ExternalWebsitesApi = new ExternalWebsitesApi()
	public providerLinksAPI: ProviderLinksApi = new ProviderLinksApi()
	public externalWebsiteCategoriesAPI: ExternalWebsiteCategoriesApi =
		new ExternalWebsiteCategoriesApi()
	public chartDataAPI: ChartDataApi = new ChartDataApi()
	public apiKeyAPI: APIKeyApi = new APIKeyApi()
	public feedbackApi: FeedbackApi = new FeedbackApi()
	public apiKey: string

	constructor(apiURL: string, apiKey: string) {
		this._apiURL = apiURL
		this.apiKey = apiKey
		this.apiKeyAPI = new APIKeyApi(
			new Configuration({
				basePath: this._apiURL,
			})
		)
		this.resetConfig()
	}

	public async validateKeyAsync() {
		return fetch(`${this._apiURL}/api/v3/APIKeys/ValidateKey`).then((res) => { return true }).catch((err) => { return false })
	}

	private _genConfig(url: string) {
		let config = new Configuration({
			basePath: url,
			middleware: [new APIKeyMiddleware(this.apiKey)],
		})

		return config
	}

	public resetConfig() {
		this.generalApi = new GeneralApi(this._genConfig(this._apiURL))
		this.tpsApi = new TPSApi(this._genConfig(this._apiURL))
		this.gpsApi = new GPSApi(this._genConfig(this._apiURL))
		this.gtpsApi = new GasAdjustedTPSApi(this._genConfig(this._apiURL))
		this.experimentAPI = new ExperimentApi(this._genConfig(this._apiURL))
		this.externalWebsitesAPI = new ExternalWebsitesApi(
			this._genConfig(this._apiURL)
		)

		this.apiKeyAPI = new APIKeyApi(this._genConfig(this._apiURL))

		this.chartDataAPI = new ChartDataApi(this._genConfig(this._apiURL))
		this.l2DataApi = new L2DataApi(this._genConfig(this._apiURL))
		this.externalWebsiteCategoriesAPI = new ExternalWebsiteCategoriesApi(
			this._genConfig(this._apiURL)
		)
		this.providerLinksAPI = new ProviderLinksApi(
			this._genConfig(this._apiURL)
		)
		this.feedbackApi = new FeedbackApi(
			this._genConfig(this._apiURL)
		)
		/*
	this.statusAPI = new StatusApi(
	  new Configuration({
		basePath: this._statusAPIEndpoint,
	  }),
	)*/
	}

	public async getProvidersAsync() {
		return await this.generalApi.apiV2ProvidersGet()
	}

	public getNetworksAsync(): Promise<Array<string>> {
		return this.generalApi.apiV2NetworksGet()
	}

	public getIntervals(): Promise<string[]> {
		return this.generalApi.apiV2IntervalsGet()
	}

	public getData(
		dataType: ETHTPSDataCoreDataType,
		interval: ETHTPSDataCoreTimeInterval,
		provider?: string,
		network?: string,
		includeSidechains?: boolean
	): Promise<DataResponseModelDictionary> {
		switch (dataType) {
			case ETHTPSDataCoreDataType.TPS:
				return this.tpsApi.apiV2TPSGetGet({
					provider,
					network,
					includeSidechains,
					interval,
				})
			case ETHTPSDataCoreDataType.GAS_ADJUSTED_TPS:
				return this.gtpsApi.apiV2GasAdjustedTPSGetGet({
					provider,
					network,
					includeSidechains,
					interval,
				})
			case ETHTPSDataCoreDataType.GPS:
				return this.gpsApi.apiV2GPSGetGet({
					provider,
					network,
					includeSidechains,
					interval,
				})
			default:
				throw TypeError('Invalid data type')
		}
	}

	public getMax(
		dataType: ETHTPSDataCoreDataType,
		provider?: string,
		network: string = 'Mainnet',
		includeSidechains?: boolean
	): Promise<DataPointDictionary> | undefined {
		switch (dataType) {
			case ETHTPSDataCoreDataType.TPS:
				return this.tpsApi.apiV2TPSMaxGet({
					provider,
					network,
					includeSidechains,
				})
			case ETHTPSDataCoreDataType.GPS:
				return this.gpsApi.apiV2GPSMaxGet({
					provider,
					network,
					includeSidechains,
				})
			case ETHTPSDataCoreDataType.GAS_ADJUSTED_TPS:
				return this.gtpsApi.apiV2GasAdjustedTPSMaxGet({
					provider,
					network,
					includeSidechains,
				})
			default:
				return undefined
		}
	}

	public getInstantData(smoothing: ETHTPSDataCoreTimeInterval) {
		return this.generalApi.apiV2InstantDataGet({
			includeSidechains: true,
			provider: 'All',
			//toShortString_2(smoothing),
		})
	}

	public async getNewAPIKey(humanityProof: string) {
		return await this.apiKeyAPI.apiV3APIKeysRegisterNewKeyForProofGetNewKeyGet(
			{
				humanityProof,
			}
		)
	}

	public getProviderColorDictionary(): Promise<StringDictionary> {
		return this.generalApi.apiV2ColorDictionaryGet()
	}

	public getProviderTypeColorDictionary(): Promise<StringDictionary> {
		return this.generalApi.apiV2ProviderTypesColorDictionaryGet()
	}

	public getIntervalsWithData(provider: string) {
		return this.generalApi.apiV2GetIntervalsWithDataGet({ provider })
	}

	public getAvailableExperiments(deviceType: string) {
		return this.experimentAPI.apiV3ExperimentsGetAvailableExperimentsGet({
			deviceType,
		})
	}

	public getLastMinuteData(dataType: ETHTPSDataCoreDataType) {
		switch (dataType) {
			case ETHTPSDataCoreDataType.TPS:
				return this.tpsApi.apiV2TPSGetGet({
					interval: ETHTPSDataCoreTimeInterval.ONE_MINUTE,
				})
			case ETHTPSDataCoreDataType.GPS:
				return this.gpsApi.apiV2GPSGetGet({
					interval: ETHTPSDataCoreTimeInterval.ONE_MINUTE,
				})
			default:
				return this.gtpsApi.apiV2GasAdjustedTPSGetGet({
					interval: ETHTPSDataCoreTimeInterval.ONE_MINUTE,
				})
		}
	}
	public getStreamChartData(
		requestParameters?: ApiV3ChartDataGetStreamchartDataGetRequest
	) {
		return this.chartDataAPI.apiV3ChartDataGetStreamchartDataGet(
			requestParameters
		)
	}

	public getStackedChartData(
		requestParameters: ApiV3ChartDataGetStackedChartDataGetRequest
	) {
		return this.chartDataAPI.apiV3ChartDataGetStackedChartDataGet(
			requestParameters
		)
	}
	public async getL2Data(request: ApiV3L2DataGetPostRequest) {
		return await this.l2DataApi.apiV3L2DataGetPost(request)
	}

	public async getTimedL2Data(request: ApiV3L2DataGetPostRequest) {
		return await this.l2DataApi.apiV3L2DataGetDataRequestGet(request)
	}

	public async getJunkL2Data(
		dataType: ETHTPSDataCoreDataType,
		interval: ETHTPSDataCoreTimeInterval,
		provider?: string,
		network?: string,
		includeSidechains?: boolean
	) {
		return await this.l2DataApi.apiV3L2DataGetSingleDatasetJunkGet()
	}

	public async getAllExternalWebsites() {
		return await this.externalWebsitesAPI.apiV3ExternalWebsitesGetAllGet()
	}

	public async getProviderLinks(provider: string) {
		return await this.providerLinksAPI.apiV3ProviderLinksGetLinksForGet({
			providerName: provider,
		})
	}

	public async getAllExternalWebsiteCategories() {
		return await this.externalWebsiteCategoriesAPI.apiV3ExternalWebsiteCategoriesGetAllGet()
	}

	public async createProviderRequestAsync(params: ApiV3FeedbackRequestNewL2PostRequest) {
		return await this.feedbackApi.apiV3FeedbackRequestNewL2Post(params)
	}

	public async reportIssueAsync(params: ApiV3FeedbackReportIssuePostRequest) {
		return await this.feedbackApi.apiV3FeedbackReportIssuePost(params)
	}
}
