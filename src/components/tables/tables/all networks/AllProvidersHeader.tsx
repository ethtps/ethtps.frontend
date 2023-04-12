import React from 'react'
import { TableHeader } from '../TableHeader'
import { liveDataHooks, toShortString } from '@/data/src'

export function AllProvidersHeader(): JSX.Element {
  const mode = liveDataHooks.useGetLiveDataModeFromAppStore()
  const modeStr = toShortString(mode)
  return (
    <React.Fragment>
      <TableHeader
        text={['#', 'Name', modeStr, `Max recorded ${modeStr}`, 'Type']}
      />
    </React.Fragment>
  )
}
