import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { maybeStorage } from '../infra/LocalStorageHelper'

const initialState: number[] = JSON.parse(
	maybeStorage?.getItem('experiments') ?? '[]'
)

const experimentSlice = createSlice({
	name: 'experiments',
	initialState,
	reducers: {
		setExperiments(
			state: number[],
			action: PayloadAction<number[] | undefined>
		) {
			maybeStorage?.setItem('experiments', JSON.stringify(action.payload))
			return action.payload
		},
	},
})

export const { setExperiments } = experimentSlice.actions
export const experimentReducer = experimentSlice.reducer
