import {
  ICustomCellConfiguration,
  buildClassNames
} from './ICustomCellConfiguration'
import React from 'react'
import { conditionalRender } from '@/services'
import { IconButton } from '@/components/buttons/IconButton'
import { IconArrowRight } from '@tabler/icons-react'

interface IIndexCellConfiguration extends ICustomCellConfiguration {
  index: number
  showTick?: boolean
}

export function IndexCell(config: IIndexCellConfiguration) {
  return (
    <React.Fragment>
      <td
        {...buildClassNames(config)}
        onClick={() =>
          config.clickCallback !== undefined
            ? config.clickCallback(config.provider, 'Index')
            : () => {}
        }>
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
      </td>
    </React.Fragment>
  )
}
