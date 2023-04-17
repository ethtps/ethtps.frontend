import { setApplicationDataLoaded, setStoreAPIKey } from "../slices"
import { useAppSelector, AppState, useAppDispatch } from "../"

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
