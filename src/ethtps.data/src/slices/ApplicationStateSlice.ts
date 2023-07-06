import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { IDataLoadingModel } from '..'
import { AppState } from '../store'

const initialState: IDataLoadingModel = {
	applicationDataLoaded: false,
	completeApplicationDataAvailableInLocalStorage: false,
	apiKey: '',
	hasProvenIsHuman: false,
}

export const applicationStateSlice = createSlice({
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
		setCompleteApplicationDataAvailableInLocalStorage(
			state: IDataLoadingModel,
			action: PayloadAction<boolean | undefined>
		) {
			if (action.payload === undefined) return state

			localStorage?.setItem(
				'completeApplicationDataAvailableInLocalStorage',
				JSON.stringify(action.payload)
			)
			state.completeApplicationDataAvailableInLocalStorage =
				action.payload
			return state
		},
		setStoreAPIKey(
			state: IDataLoadingModel,
			action: PayloadAction<string | undefined>
		) {
			localStorage?.setItem('XAPIKey', action.payload as string)
			state.apiKey = action.payload as string
			return state
		},
	},
})

export const {
	setApplicationDataLoaded,
	setStoreAPIKey,
	setCompleteApplicationDataAvailableInLocalStorage,
} = applicationStateSlice.actions
export const applicationStateReducer = applicationStateSlice.reducer
export const selectAppState = (state: AppState) => state.applicationState
