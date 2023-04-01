import { AppState } from '@/data/src/store'
import { useSelector } from 'react-redux'
export const useAppState = () => useSelector<AppState>((x) => x) as AppState
