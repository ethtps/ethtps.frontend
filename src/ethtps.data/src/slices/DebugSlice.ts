import { DebugModel, EffectDetails } from '../'



import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const initialState: DebugModel = {
    enabled: (typeof window === 'undefined' ? true : localStorage?.getItem('debugMode')) === 'true' ? true : false,
    effects: {}
}


const debugSlice = createSlice({
    name: 'debug',
    initialState,
    reducers: {
        enableDebugMode(
            state: DebugModel,
            action: PayloadAction<DebugModel | undefined>
        ) {
            localStorage?.setItem('debugMode', JSON.stringify(action.payload))
            state.enabled = true
            return state
        },
        disableDebugMode(
            state: DebugModel,
            action: PayloadAction<DebugModel | undefined>
        ) {
            localStorage?.setItem('debugMode', JSON.stringify(action.payload))
            state.enabled = false
            return state
        },
        toggleDebugMode(state: DebugModel,
            action: PayloadAction<DebugModel | undefined>) {
            state = {
                ...state,
                enabled: !state.enabled
            }
            localStorage?.setItem('debugMode', JSON.stringify(state))
            return state
        },
        setEffect(state: DebugModel, action: PayloadAction<Partial<EffectDetails>>) {
            if (action.payload.name) {
                // increment total calls if this effect has been called before
                state.effects[action.payload.name] = {
                    ...action.payload,
                    totalCalls: state.effects[action.payload.name]?.totalCalls ? state.effects[action.payload.name]?.totalCalls! + 1 : 1,
                }
                state.effects[action.payload.name].totalTimeMs = state.effects[action.payload.name].totalTimeMs ? state.effects[action.payload.name].totalTimeMs! + action.payload.timeMs! : action.payload.timeMs!
            }
            return state
        }
    },
})

export const { enableDebugMode, disableDebugMode, toggleDebugMode, setEffect } = debugSlice.actions
export const debugReducer = debugSlice.reducer
