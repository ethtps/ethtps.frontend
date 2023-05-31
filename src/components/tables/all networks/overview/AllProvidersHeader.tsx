import {
  m_toShortString,
  toShortString,
  useGetLiveDataModeFromAppStore
} from '@/data'
import React from 'react'
import { TableHeader } from '../../TableHeader'

export function AllProvidersHeader(): JSX.Element {
  const mode = useGetLiveDataModeFromAppStore()
  const modeStr = m_toShortString(mode)
  return (
    <>
      <TableHeader items={[
        { text: '#' },
        { text: 'Name' },
        { text: 'Type' },
        { text: 'TPS' },
        {
          text: `Max recorded TPS`
        },
      ]}
      />
    </>
  )
}
