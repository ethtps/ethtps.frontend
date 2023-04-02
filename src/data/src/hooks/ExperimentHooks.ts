import { useAppSelector, AppState } from '../store'

export const useGetExperimentsFromAppStore = () => {
	return useAppSelector((state: AppState) => state.experiments) as number[]
}
