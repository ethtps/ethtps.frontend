import { useMemo, useState } from 'react'
import { IComponentSize } from '../../..'

export const useChartControlExpansion = () => {
  const [state, setState] = useState<ExpansionState>()
  const expansionHandler = useMemo<ExpansionEvent>(() => {
    return (expanded: boolean, expansionSize: IComponentSize) => {
      setState({ expanded, expansionSize })
    }
  }, [setState])
  return {
    state,
    handler: expansionHandler
  } as ChartControlExpansionEffectHandler
}

export type ExpansionState = {
  expanded: boolean | undefined
  expansionSize: IComponentSize | undefined
}

export type ExpansionEvent = (expanded: boolean, expansionSize: IComponentSize) => void

export type ExpansionEventHandler = {
  handler: ExpansionEvent
}

export type ChartControlExpansionEffectHandler = ExpansionEventHandler & {
  state: ExpansionState | undefined
}