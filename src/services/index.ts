import { queryClient, storage } from './DependenciesIOC'
import { useAppState } from '@/services/data/Hooks'
import { conditionalRender } from './Types'
import { openNewTab } from './helpers/LinksHelper'
import { useAppSelector } from './data/Hooks'
import { sleep } from './helpers/Helpers'
export {
  queryClient,
  useAppState,
  conditionalRender,
  openNewTab,
  sleep,
  useAppSelector
}
