import { PayloadAction, createSlice } from '@reduxjs/toolkit'
const initialState: Array<string> = JSON.parse(
	maybeStorage?.getItem('intervals') ?? '[]'
)
import { maybeStorage } from 'src/infra/LocalStorageHelper'

const intervalsSlice = createSlice({
	name: 'intervals',
	initialState,
	reducers: {
		setIntervals(
			state: string[],
			action: PayloadAction<string[] | undefined>
		) {
			if (action.payload !== undefined) {
				maybeStorage?.setItem(
					'intervals',
					JSON.stringify(action.payload)
				)
				state.length = 0
				state = [...action.payload]
			}
		},
	},
})

export const { setIntervals } = intervalsSlice.actions
export const intervalsReducer = intervalsSlice.reducer
