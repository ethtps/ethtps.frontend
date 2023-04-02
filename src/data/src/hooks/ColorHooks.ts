import { StringDictionary } from 'src/common-types/Dictionaries'
import { useAppSelector, AppState } from '../store'

export function useGetProviderColorDictionaryFromAppStore() {
	return useAppSelector((state: AppState) => state.colors.providerColorDictionary) as StringDictionary
}

export function useGetProviderTypeColorDictionaryFromAppStore() {
	return useAppSelector((state: AppState) => state.colors.providerTypesColorDictionary)as StringDictionary
}
