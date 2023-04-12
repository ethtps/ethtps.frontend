import {
	setApplicationDataLoaded,
	setStoreAPIKey,
} from '../slices/ApplicationStateSlice'
import { websocketActions } from '../slices/WebsocketSubscriptionSlice'
import { wsBaseURL } from '../models/services/DependenciesIOC'
import { AppState, useAppDispatch, useAppSelector } from '../store';

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
	useAppDispatch(websocketActions.setWSURL(wsBaseURL + apiKey))
}
