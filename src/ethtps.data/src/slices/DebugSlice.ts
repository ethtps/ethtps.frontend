import { DebugModel } from '../'



import { PayloadAction, createSlice } from '@reduxjs/toolkit'

const initialState: Omit<DebugModel, 'effects'> = {
    enabled: (typeof window === 'undefined' ? true : localStorage?.getItem('debugMode')) === 'true' ? true : false
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
        }
    },
})

export const { enableDebugMode, disableDebugMode, toggleDebugMode } = debugSlice.actions
export const debugReducer = debugSlice.reducer
