import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
	InstantDataResponseModel,
	DataResponseModelDictionary,
} from '../common-types/Dictionaries'
import { ILiveDataModeModel } from '../models/interfaces/ILiveDataModeModel'
import { maybeStorage } from '../infra/LocalStorageHelper'
import { TimeInterval } from '../../../api-client/src/models/TimeInterval'
import { DataType } from '../../../api-client/src/models/DataType'

const initialState: ILiveDataModeModel = {
	liveDataSmoothing: TimeInterval.Instant,
	liveDataType: DataType.Tps,
	includeSidechains: JSON.parse(
		maybeStorage?.getItem('includeSidechains') ?? 'false'
	),
	oneMinuteTPSData: JSON.parse(
		maybeStorage?.getItem('oneMinuteTPSData') ?? '{}'
	),
	oneMinuteGPSData: JSON.parse(
		maybeStorage?.getItem('oneMinuteGPSData') ?? '{}'
	),
	oneMinuteGTPSData: JSON.parse(
		maybeStorage?.getItem('oneMinuteGTPSData') ?? '{}'
	),
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
			action: PayloadAction<TimeInterval | undefined>
		) {
			if (action.payload === undefined) return state
			state.liveDataSmoothing = action.payload
		},

		setLiveDataType(
			state: ILiveDataModeModel,
			action: PayloadAction<DataType | undefined>
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
			maybeStorage?.setItem(
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
				case DataType.Tps:
					maybeStorage?.setItem(
						'oneMinuteTPSData',
						JSON.stringify(action.payload)
					)
					state.oneMinuteTPSData = action.payload
					break
				case DataType.Gps:
					maybeStorage?.setItem(
						'oneMinuteGPSData',
						JSON.stringify(action.payload)
					)
					state.oneMinuteGPSData = action.payload
					break
				default:
					maybeStorage?.setItem(
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
