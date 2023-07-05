import { Td, Text } from '@chakra-ui/react'
import {
  ICustomCellConfiguration,
  buildClassNames
} from './ICustomCellConfiguration'
import React from 'react'
import { useGetProviderTypeColorDictionaryFromAppStore } from '@/data'
import { useColors } from '@/services'

export function ProviderTypeCell(config: ICustomCellConfiguration) {
  const colors = useColors()
  return (
    <>
      <Td
        minW={'200px'}
        textColor={colors.text}
        onClick={() =>
          config.clickCallback !== undefined
            ? config.clickCallback(config.provider, 'ProviderType')
            : () => { }
        } >
        <Text className={'boldcell'}>{config.provider?.type}</Text>
      </Td>
    </>
  )
}
