import { AppState, useAppDispatch, useAppSelector } from '..'
import { setApplicationDataLoaded, setStoreAPIKey } from '../slices'

export const useGetApplicationDataLoadedFromAppStore = () => {
	return useAppSelector(
		(state: AppState) => state.applicationState.applicationDataLoaded
	) as boolean
}

export const useMarkApplicationDataLoaded = () => {
	useAppDispatch(setApplicationDataLoaded(true))
}

export const useSetStoreAPIKey = (apiKey?: string) => {
	useAppDispatch(setStoreAPIKey(apiKey))
	//useAppDispatch(websocketActions.setWSURL(wsBaseURL + apiKey))
}
