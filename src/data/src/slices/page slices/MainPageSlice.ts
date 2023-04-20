import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { IMainPageModel } from '../../models'

const initialState: IMainPageModel = {}

const mainPage = createSlice({
	name: 'mainPage',
	initialState,
	reducers: {
		setHighlightedProvider(
			state: IMainPageModel,
			action: PayloadAction<string | undefined>
		) {
			state.highlighedProvider = action.payload
		},
	},
})

export const { setHighlightedProvider } = mainPage.actions
export const mainPageReducer = mainPage.reducer
