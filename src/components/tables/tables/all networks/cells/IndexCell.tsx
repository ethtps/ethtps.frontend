import {
  ICustomCellConfiguration,
  buildClassNames
} from './ICustomCellConfiguration'
import { ArrowRight } from '@mui/icons-material'
import React from 'react'
import { conditionalRender } from '@/services'
import { IconButton } from '@/components/buttons/IconButton'

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
            fontSize: '13px',
            height: '1rem',
            width: '2rem',
            fontWeight: config.showTick ? 'bold' : undefined
          }}
          icon={
            <>
              {conditionalRender(<ArrowRight />, config.showTick)}
              {config.index}
            </>
          }
        />
      </td>
    </React.Fragment>
  )
}
