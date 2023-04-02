import { Text } from '@mantine/core'
import {
  ICustomCellConfiguration,
  buildClassNames
} from './ICustomCellConfiguration'
import React from 'react'
import { centered } from '../../Cells.Types'
import { useGetProviderTypeColorDictionaryFromAppStore } from '@/data/src'

export function ProviderTypeCell(config: ICustomCellConfiguration) {
  const colorDictionary = useGetProviderTypeColorDictionaryFromAppStore()
  const name = config.provider?.type ?? ''
  const color: string =
    colorDictionary !== undefined ? colorDictionary[name] : 'primary'
  return (
    <React.Fragment>
      <td
        {...buildClassNames(config)}
        style={{ color: color }}
        onClick={() =>
          config.clickCallback !== undefined
            ? config.clickCallback(config.provider, 'ProviderType')
            : () => {}
        }>
        <Text>{config.provider?.type}</Text>
      </td>
    </React.Fragment>
  )
}
