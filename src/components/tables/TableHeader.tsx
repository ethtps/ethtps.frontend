/* eslint-disable import/no-internal-modules */
import React from 'react'
import { Text } from '@mantine/core'
import { tableHeaderCellTypography } from './all networks/cells/Typography.types'
interface ITableHeaderParams {
  text?: string[]
}

export function TableHeader(params: ITableHeaderParams): JSX.Element {
  return (
    <>
      {params.text?.map((x, i) => (
        <td style={{ fontWeight: 'bold' }} height={50} key={i}>
          <Text {...tableHeaderCellTypography}> {x}</Text>
        </td>
      ))}
    </>
  )
}
