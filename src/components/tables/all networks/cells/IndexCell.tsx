import {
  ICustomCellConfiguration,
  buildClassNames
} from './ICustomCellConfiguration'
import React from 'react'
import { conditionalRender, useColors } from '@/services'
import { IconButton } from '@/components'
import { IconArrowRight } from '@tabler/icons-react'
import { Td } from '@chakra-ui/react'

interface IIndexCellConfiguration extends ICustomCellConfiguration {
  index: number
  showTick?: boolean
}

export function IndexCell(config: IIndexCellConfiguration) {
  const colors = useColors()
  return (
    <>
      <Td
        color={colors.text}
        onClick={() =>
          config.clickCallback !== undefined
            ? config.clickCallback(config.provider, 'Index')
            : () => { }
        } >
        <IconButton
          sx={{
            fontSize: '1rem',
            height: '1rem',
            width: '2rem',
            fontWeight: config.showTick ? 'bold' : undefined
          }}
          icon={
            <>
              {conditionalRender(<IconArrowRight />, config.showTick)}
              {config.index}
            </>
          }
        />
      </Td>
    </>
  )
}
