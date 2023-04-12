import { useAppSelector, AppState } from '../store'

export function useGetIntervalsFromAppStore() {
	return useAppSelector((state: AppState) => state.intervals) as string[]
}
