import {
  dataTypeToString,
  m_toShortString,
  toShortString,
  useGetLiveDataModeFromAppStore
} from '@/data'
import React from 'react'
import { TableHeader } from '../../TableHeader'
import { DataType } from '@/api-client'

export function AllProvidersHeader(props: {
  dataType: DataType
}): JSX.Element {
  const mode = useGetLiveDataModeFromAppStore()
  const modeStr = m_toShortString(mode)
  return (
    <>
      <TableHeader items={[
        { text: '#' },
        { text: 'Name' },
        { text: 'Type' },
        { text: dataTypeToString(props.dataType) },
        {
          text: `Max recorded ${dataTypeToString(props.dataType)}`
        },
      ]}
      />
    </>
  )
}
