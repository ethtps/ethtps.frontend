import { providersReducer } from './slices/ProvidersSlice'
import { networksReducer } from './slices/NetworksSlice'
import { intervalsReducer } from './slices/IntervalsSlice'
import { dataReducer } from './slices/DataSlice'
import { liveDataReducer } from './slices/LiveDataSlice'
import { colorReducer } from './slices/ColorSlice'
import { experimentReducer } from './slices/ExperimentSlice'
import { applicationStateReducer } from './slices/ApplicationStateSlice'
import { Action, AnyAction, Dispatch, ThunkAction, ThunkDispatch, configureStore } from '@reduxjs/toolkit'
import {
	ApplicationState,
	IApplicationState,
} from './models/dependencies/ApplicationState'
import { createWrapper } from "next-redux-wrapper";

const preloadedState = new ApplicationState(false, false)
const makeStore = () => configureStore({
	reducer: {
		providers: providersReducer,
		networks: networksReducer,
		intervals: intervalsReducer,
		maxData: dataReducer,
		liveData: liveDataReducer,
		colors: colorReducer,
		experiments: experimentReducer,
		applicationState: applicationStateReducer,
	},
	...(preloadedState as IApplicationState),
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		})
})
export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
	>;
export type RootState = { appState: AppState }
export type AppDispatch = Dispatch<AnyAction> & ThunkDispatch<RootState, null, AnyAction>
export const wrapper = createWrapper<AppStore>(makeStore);