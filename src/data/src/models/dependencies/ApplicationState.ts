import { IMaxDataModel } from '../interfaces/IMaxDataModel'
import { IDataModeModel } from '../interfaces/IDataModeModel'
import { ILiveDataModeModel } from '../interfaces/ILiveDataModeModel'
import { IColorDictionaries } from '../interfaces/IColorDictionaries'
import { IDataLoadingModel } from '../interfaces/IDataLoadingModel'
import { IMainPageModel } from '../interfaces/IMainPageModel'
import { IPagesState } from '../IPagesState'
import { WebsocketSubscriptionState } from '../../slices/WebsocketSubscriptionSlice'
import { ProviderResponseModel } from '../../../../api-client/src/models/ProviderResponseModel'
import { defaultColorDictionary, defaultNetworks, defaultProviderTypeColorDictionary, defaultProviders } from '../default data'

export interface IApplicationState extends IDataLoadingModel {
	websockets?: WebsocketSubscriptionState
	colorDictionaries?: IColorDictionaries
	dataLoading?: IDataLoadingModel
	dataMode?: IDataModeModel
	liveData?: ILiveDataModeModel
	mainPage?: IMainPageModel
	maxData?: IMaxDataModel
	experiments?: number[]
	intervals?: Array<string>
	networks?: Array<string>
	providers?: ProviderResponseModel[]
}

export class ApplicationState implements IApplicationState {
	constructor(
		public applicationDataLoaded: boolean = false,
		public completeApplicationDataAvailableInLocalStorage: boolean,
		public apiKey?: string,
		public hasProvenIsHuman: boolean = false,
		public websockets?: WebsocketSubscriptionState,
		public colorDictionaries?: IColorDictionaries,
		public dataLoading?: IDataLoadingModel,
		public dataMode?: IDataModeModel,
		public liveData?: ILiveDataModeModel,
		public mainPage?: IMainPageModel,
		public maxData?: IMaxDataModel,
		public experiments?: number[],
		public intervals?: Array<string>,
		public networks?: Array<string>,
		public providers?: ProviderResponseModel[]
	) {
		this.colorDictionaries ??= {
			providerColorDictionary: defaultColorDictionary,
			providerTypesColorDictionary: defaultProviderTypeColorDictionary
		}
		this.networks ??= defaultNetworks
		this.providers ??= defaultProviders
	}
}
