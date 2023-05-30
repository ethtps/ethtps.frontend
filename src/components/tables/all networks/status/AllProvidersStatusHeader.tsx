import {
  m_toShortString,
  toShortString,
  useGetLiveDataModeFromAppStore
} from '@/data'
import React from 'react'
import { TableHeader } from '../../TableHeader'

export default function AllProvidersStatusHeader(): JSX.Element {
  const mode = useGetLiveDataModeFromAppStore()
  const modeStr = m_toShortString(mode)
  return (
    <>
      <TableHeader text={['#', 'Name', 'Status']}
      />
    </>
  )
}
