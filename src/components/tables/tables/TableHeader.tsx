import React from 'react'
import { Text } from '@mantine/core'
import { tableHeaderCellTypography } from '.'
interface ITableHeaderParams {
  text?: string[]
}

export function TableHeader(params: ITableHeaderParams): JSX.Element {
  return (
    <React.Fragment>
      {params.text?.map((x, i) => (
        <td style={{ fontWeight: 'bold' }} height={50} key={i}>
          <Text {...tableHeaderCellTypography}> {x}</Text>
        </td>
      ))}
    </React.Fragment>
  )
}
