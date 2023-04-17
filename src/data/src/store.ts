import { createWrapper } from 'next-redux-wrapper'
import { EqualityFn, useDispatch, useSelector } from 'react-redux'
import {
	Action,
	AnyAction,
	Dispatch,
	PayloadAction,
	ThunkAction,
	ThunkDispatch,
	configureStore,
} from '@reduxjs/toolkit'
import { ApplicationState, IApplicationState } from './models'
import {
	providersReducer,
	networksReducer,
	intervalsReducer,
	dataReducer,
	liveDataReducer,
	colorReducer,
	experimentReducer,
	applicationStateReducer,
} from './slices'

const preloadedState = new ApplicationState(false, false)
const makeStore = () =>
	configureStore({
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
			}),
	})
export type AppStore = ReturnType<typeof makeStore>
export type AppState = ReturnType<AppStore['getState']>
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	AppState,
	unknown,
	Action
>
export interface RootState {
	appState: AppState
}
export type AppDispatch = Dispatch<AnyAction> &
	ThunkDispatch<RootState, null, AnyAction>
export const wrapper = createWrapper<AppStore>(makeStore)
export const useAppState = () => useSelector<AppState>((x) => x) as AppState
export function useAppSelector<T>(
	selector: (state: AppState) => T,
	equalityFn?: EqualityFn<T>
) {
	return useSelector<AppState, T>(selector)
}
export const useAppDispatch = (action: AnyAction) => useDispatch()(action)
