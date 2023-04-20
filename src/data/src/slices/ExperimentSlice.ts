import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const initialState: number[] = []

const experimentSlice = createSlice({
	name: 'experiments',
	initialState,
	reducers: {
		setExperiments(
			state: number[],
			action: PayloadAction<number[] | undefined>
		) {
			localStorage?.setItem('experiments', JSON.stringify(action.payload))
			return action.payload
		},
	},
})

export const { setExperiments } = experimentSlice.actions
export const experimentReducer = experimentSlice.reducer
