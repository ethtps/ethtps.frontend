import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ETHTPSDataCoreDataType, ETHTPSDataCoreTimeInterval } from 'ethtps.api'
import {
	DataResponseModelDictionary,
	InstantDataResponseModel
} from '../common-types'
import { ILiveDataModeModel } from '../models'

const initialState: ILiveDataModeModel = {
	liveDataSmoothing: 'Instant' as ETHTPSDataCoreTimeInterval,
	liveDataType: ETHTPSDataCoreDataType.TPS as ETHTPSDataCoreDataType,
	includeSidechains: false,
	oneMinuteTPSData: {},
	oneMinuteGPSData: {},
	oneMinuteGTPSData: {},
	currentVisitors: 0,
}

const liveDataSlice = createSlice({
	name: 'live data',
	initialState,
	reducers: {
		setCurrentVisitors(
			state: ILiveDataModeModel,
			action: PayloadAction<number | undefined>
		) {
			state.currentVisitors = action.payload ?? 1
		},

		setLiveDataSmoothing(
			state: ILiveDataModeModel,
			action: PayloadAction<ETHTPSDataCoreTimeInterval | undefined>
		) {
			if (action.payload === undefined) return state
			state.liveDataSmoothing = action.payload
		},

		setLiveDataType(
			state: ILiveDataModeModel,
			action: PayloadAction<ETHTPSDataCoreDataType | undefined>
		) {
			if (action.payload === undefined) return state
			state.liveDataType = action.payload
		},

		setLiveData(
			state: ILiveDataModeModel,
			action: PayloadAction<InstantDataResponseModel | undefined>
		) {
			if (!action.payload) return state
			state.data = action.payload
		},

		setIncludeSidechains(
			state: ILiveDataModeModel,
			action: PayloadAction<boolean | undefined>
		) {
			localStorage?.setItem(
				'includeSidechains',
				JSON.stringify(action.payload)
			)
			state.includeSidechains = action.payload ?? false
		},

		setLastMinuteData(
			state: ILiveDataModeModel,
			action: PayloadAction<DataResponseModelDictionary | undefined>
		) {
			switch (state.liveDataType) {
				case ETHTPSDataCoreDataType.TPS:
					localStorage?.setItem(
						'oneMinuteTPSData',
						JSON.stringify(action.payload)
					)
					state.oneMinuteTPSData = action.payload
					break
				case ETHTPSDataCoreDataType.GPS:
					localStorage?.setItem(
						'oneMinuteGPSData',
						JSON.stringify(action.payload)
					)
					state.oneMinuteGPSData = action.payload
					break
				default:
					localStorage?.setItem(
						'oneMinuteTPSData',
						JSON.stringify(action.payload)
					)
					state.oneMinuteGTPSData = action.payload
					break
			}
		},
	},
})

export const {
	setCurrentVisitors,
	setLiveDataSmoothing,
	setLiveDataType,
	setLiveData,
	setIncludeSidechains,
	setLastMinuteData,
} = liveDataSlice.actions

export const liveDataReducer = liveDataSlice.reducer
