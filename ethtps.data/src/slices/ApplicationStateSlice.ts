import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { IDataLoadingModel } from '../models/interfaces/IDataLoadingModel'
import { maybeStorage } from '../infra/LocalStorageHelper'

const initialState: IDataLoadingModel = {
	applicationDataLoaded: false,
	completeApplicationDataAvailableInLocalStorage: false,
	apiKey: maybeStorage?.getItem('XAPIKey'),
}

const applicationStateSlice = createSlice({
	name: 'applicationStates',
	initialState,
	reducers: {
		setApplicationDataLoaded(
			state: IDataLoadingModel,
			action: PayloadAction<boolean | undefined>
		) {
			if (action.payload === undefined) return state

			state.applicationDataLoaded = action.payload
			return state
		},
		setStoreAPIKey(
			state: IDataLoadingModel,
			action: PayloadAction<string | undefined>
		) {
			maybeStorage?.setItem('XAPIKey', action.payload as string)
			state.apiKey = action.payload as string
			return state
		},
	},
})

export const { setApplicationDataLoaded, setStoreAPIKey } =
	applicationStateSlice.actions
export const applicationStateReducer = applicationStateSlice.reducer
