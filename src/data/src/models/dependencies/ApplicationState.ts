import { ProviderResponseModel } from '../../../../api-client'
import {
	defaultColorDictionary,
	defaultProviderTypeColorDictionary,
	defaultNetworks,
	defaultProviders,
} from '../default data'
import {
	IColorDictionaries,
	IDataLoadingModel,
	IDataModeModel,
	ILiveDataModeModel,
	IMainPageModel,
	IMaxDataModel,
} from '../interfaces'

export interface IApplicationState extends IDataLoadingModel {
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
			providerTypesColorDictionary: defaultProviderTypeColorDictionary,
		}
		this.networks ??= defaultNetworks
		this.providers ??= defaultProviders
	}
}
