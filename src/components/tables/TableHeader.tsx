/* eslint-disable import/no-internal-modules */
import React from 'react'
import { Td, Text, Th } from '@chakra-ui/react'
import { tableHeaderCellTypography } from './all networks/cells/Typography.types'
interface ITableHeaderParams {
  text?: string[]
}

export function TableHeader(params: ITableHeaderParams): JSX.Element {
  return (
    <>
      {params.text?.map((x, i) => (
        <Th fontSize={'1rem'} height={50} key={i} alignContent={'center'}>
          {x}
        </Th >
      ))
      }
    </>
  )
}
