import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { DataPointDictionary, IDataModel } from '..'

const initialState: IDataModel = {
	tpsData: {},
	gpsData: {},
	gtpsData: {},
}

function modifyMaxDataState(
	state: IDataModel,
	finalState: DataPointDictionary | undefined,
	f: (state: IDataModel) => DataPointDictionary | undefined
): IDataModel {
	if (finalState === undefined) return state

	let t = f(state)
	let target: DataPointDictionary = t as DataPointDictionary
	let keys = Object.keys(target)
	for (let i = 0; i < keys.length; i++) {
		delete target[keys[i]]
	}

	keys = Object.keys(finalState)
	for (let index = 0; index < keys.length; index++) {
		target[keys[index]] = finalState[keys[index]]
	}
	return state
}

const dataSlice = createSlice({
	name: 'data',
	initialState,
	reducers: {
		setMaxTPSData(
			state: IDataModel,
			action: PayloadAction<DataPointDictionary | undefined>
		) {
			localStorage?.setItem('maxTPSData', JSON.stringify(action.payload))
			return modifyMaxDataState(state, action.payload, (s) => s.tpsData)
		},
		setMaxGPSData(
			state: IDataModel,
			action: PayloadAction<DataPointDictionary | undefined>
		) {
			localStorage?.setItem('maxGPSData', JSON.stringify(action.payload))
			return modifyMaxDataState(state, action.payload, (s) => s.gpsData)
		},
		setMaxGTPSData(
			state: IDataModel,
			action: PayloadAction<DataPointDictionary | undefined>
		) {
			localStorage?.setItem('maxGTPSData', JSON.stringify(action.payload))
			return modifyMaxDataState(state, action.payload, (s) => s.gtpsData)
		},
	},
})

export const { setMaxTPSData, setMaxGPSData, setMaxGTPSData } =
	dataSlice.actions
export const dataReducer = dataSlice.reducer
