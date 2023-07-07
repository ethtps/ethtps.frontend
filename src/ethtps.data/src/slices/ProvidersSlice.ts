import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { ETHTPSDataCoreModelsResponseModelsProviderResponseModel } from 'ethtps.api'
const initialState: ETHTPSDataCoreModelsResponseModelsProviderResponseModel[] =
	[]

const providersSlice = createSlice({
	name: 'providers',
	initialState,
	reducers: {
		addProvider: (
			state: ETHTPSDataCoreModelsResponseModelsProviderResponseModel[],
			action: PayloadAction<ETHTPSDataCoreModelsResponseModelsProviderResponseModel>
		) => {
			state = [...state, action.payload]
			return [...state]
		},
		setProviders(
			state: ETHTPSDataCoreModelsResponseModelsProviderResponseModel[],
			action: PayloadAction<
				| ETHTPSDataCoreModelsResponseModelsProviderResponseModel[]
				| undefined
			>
		) {
			localStorage?.setItem('providers', JSON.stringify(action.payload))
			return action.payload
		},
	},
})

export const { addProvider, setProviders } = providersSlice.actions
export const providersReducer = providersSlice.reducer
