import { StringDictionary } from 'src/common-types/Dictionaries'
import { useAppSelector } from '../store'

export function useGetProviderColorDictionaryFromAppStore() {
	return useAppSelector((state) => state.colors.providerColorDictionary) as StringDictionary
}

export function useGetProviderTypeColorDictionaryFromAppStore() {
	return useAppSelector((state) => state.colors.providerTypesColorDictionary)as StringDictionary
}
