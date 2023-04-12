import { centered } from './Cells.Types'
import { tableHeaderCellTypography } from './all networks/cells/Typography.types'
import React from 'react'
import { Text } from '@mantine/core'
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
