import { StringDictionary } from '..'
import { AppState, useAppSelector } from '../store'

export function useGetProviderColorDictionaryFromAppStore() {
	return useAppSelector(
		(state: AppState) => state.colors.providerColorDictionary
	) as StringDictionary
}

export function useGetProviderTypeColorDictionaryFromAppStore() {
	return useAppSelector(
		(state: AppState) => state.colors.providerTypesColorDictionary
	) as StringDictionary
}
