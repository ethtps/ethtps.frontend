import { Text } from '@mantine/core'
import {
  ICustomCellConfiguration,
  buildClassNames
} from './ICustomCellConfiguration'
import React from 'react'
import { useGetProviderTypeColorDictionaryFromAppStore } from '@/data'

export function ProviderTypeCell(config: ICustomCellConfiguration) {
  const colorDictionary = useGetProviderTypeColorDictionaryFromAppStore()
  const name = config.provider?.type ?? ''
  const color: string =
    colorDictionary !== undefined ? colorDictionary[name] : 'primary'
  return (
    <>
      <td
        {...buildClassNames(config)}
        style={{ color: color }}
        onClick={() =>
          config.clickCallback !== undefined
            ? config.clickCallback(config.provider, 'ProviderType')
            : () => { }
        }>
        <Text className={'boldcell'}>{config.provider?.type}</Text>
      </td>
    </>
  )
}
