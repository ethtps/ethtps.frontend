import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { ApplicationState, IDataLoadingModel, maybeStorage } from '..'
import { dataReducer } from './DataSlice'
import { AppState } from '../store'

const initialState: IDataLoadingModel = {
	applicationDataLoaded: false,
	completeApplicationDataAvailableInLocalStorage: JSON.parse(maybeStorage?.getItem('completeApplicationDataAvailableInLocalStorage') ?? "false"),
	apiKey: maybeStorage?.getItem('XAPIKey'),
	hasProvenIsHuman:
		maybeStorage?.getItem('hasProvenIsHuman') === 'true' ?? false,
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

			maybeStorage?.setItem('completeApplicationDataAvailableInLocalStorage', JSON.stringify(action.payload))
			state.completeApplicationDataAvailableInLocalStorage = action.payload
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

export const { setApplicationDataLoaded, setStoreAPIKey, setCompleteApplicationDataAvailableInLocalStorage } =
	applicationStateSlice.actions
export const applicationStateReducer = applicationStateSlice.reducer
export const selectAppState = (state: AppState) => state.applicationState
