import { DebugModel } from '../'



import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const initialState: DebugModel = {
    enabled: (typeof window === 'undefined' ? false : localStorage?.getItem('debugMode')) === 'true' ? true : false,
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
            if (action.payload) action.payload.enabled = true
            return action.payload
        },
        disableDebugMode(
            state: DebugModel,
            action: PayloadAction<DebugModel | undefined>
        ) {
            localStorage?.setItem('debugMode', JSON.stringify(action.payload))
            if (action.payload) action.payload.enabled = false
            return action.payload
        },
        toggleDebugMode(state: DebugModel,
            action: PayloadAction<DebugModel | undefined>) {
            state = {
                ...state,
                enabled: !state.enabled
            }
            localStorage?.setItem('debugMode', JSON.stringify(state))
            return state
        }
    },
})

export const { enableDebugMode, disableDebugMode, toggleDebugMode } = debugSlice.actions
export const debugReducer = debugSlice.reducer
