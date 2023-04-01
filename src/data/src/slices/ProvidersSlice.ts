import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { maybeStorage } from '../infra/LocalStorageHelper'
import { ProviderResponseModel } from '../../../api-client/src/models/ProviderResponseModel'

const initialState: ProviderResponseModel[] = JSON.parse(
	maybeStorage?.getItem('providers') ?? '[]'
)

const providersSlice = createSlice({
	name: 'providers',
	initialState,
	reducers: {
		addProvider: (
			state: ProviderResponseModel[],
			action: PayloadAction<ProviderResponseModel>
		) => {
			state = [...state, action.payload]
			return [...state]
		},
		setProviders(
			state: ProviderResponseModel[],
			action: PayloadAction<ProviderResponseModel[] | undefined>
		) {
			maybeStorage?.setItem('providers', JSON.stringify(action.payload))
			return action.payload
		},
	},
})

export const { addProvider, setProviders } = providersSlice.actions
export const providersReducer = providersSlice.reducer
