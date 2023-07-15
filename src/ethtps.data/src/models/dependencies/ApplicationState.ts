import { ETHTPSDataCoreModelsResponseModelsProviderResponseModel } from 'ethtps.api'
import { DebugModel } from '../admin'
import {
	defaultColorDictionary,
	defaultNetworks,
	defaultProviderTypeColorDictionary,
	defaultProviders,
} from '../default data'
import {
	IColorDictionaries,
	IDataLoadingModel,
	IDataModeModel,
	IDataModel,
	ILiveDataModeModel,
	IMainPageModel,
} from '../interfaces'

export interface IApplicationState extends IDataLoadingModel {
	colorDictionaries?: IColorDictionaries
	dataLoading?: IDataLoadingModel
	dataMode?: IDataModeModel
	liveData?: ILiveDataModeModel
	mainPage?: IMainPageModel
	maxData?: IDataModel
	experiments?: number[]
	intervals?: Array<string>
	networks?: Array<string>
	debugModel?: DebugModel
	providers?: ETHTPSDataCoreModelsResponseModelsProviderResponseModel[]
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
		public maxData?: IDataModel,
		public experiments?: number[],
		public intervals?: Array<string>,
		public networks?: Array<string>,
		public providers?: ETHTPSDataCoreModelsResponseModelsProviderResponseModel[],
		public debugModel?: DebugModel
	) {
		this.colorDictionaries ??= {
			providerColorDictionary: defaultColorDictionary,
			providerTypesColorDictionary: defaultProviderTypeColorDictionary,
		}
		this.networks ??= defaultNetworks
		this.providers ??= defaultProviders
		this.debugModel ??= {
			enabled: true,
			effects: {},
		}
	}
}
