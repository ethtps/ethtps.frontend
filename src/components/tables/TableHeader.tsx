/* eslint-disable import/no-internal-modules */
import React from 'react'
import { Td, Text, Th } from '@chakra-ui/react'
import { tableHeaderCellTypography } from './all networks/cells/Typography.types'
import { useColors } from '@/services'
interface ITableHeaderParams {
  text?: string[]
}

export function TableHeader(params: ITableHeaderParams): JSX.Element {
  const colors = useColors()
  return (
    <>
      {params.text?.map((x, i) => (
        <Th
          color={colors.text}
          bgColor={colors.gray1}
          _hover={{ color: colors.primary, bgColor: colors.gray2, cursor: 's-resize' }}
          fontSize={'1rem'}
          height={50}
          key={i}
          alignContent={'center'}>
          {x}
        </Th >
      ))
      }
    </>
  )
}
