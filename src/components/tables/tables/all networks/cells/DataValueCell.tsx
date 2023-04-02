import {
  ICustomCellConfiguration,
  buildClassNames
} from './ICustomCellConfiguration'
import {} from '@mui/material'
import { tableCellTypographyStandard } from './Typography.types'
import { centered } from '../../Cells.Types'
import { DataType } from '@/api-client/src/models'
import React from 'react'
import { SkeletonWithTooltip } from '@/components/skeletons/SkeletonWithTooltip'
import { AnimatedTypography } from '@/components/text/AnimatedTypography'
import { numberFormat, toShortString } from '@/data/src'

interface IDataValueCellConficuration extends ICustomCellConfiguration {
  value?: number
  dataType: DataType
}

export function DataValueCell(config: IDataValueCellConficuration) {
  return (
    <React.Fragment>
      <td
        {...centered}
        {...buildClassNames(config)}
        onClick={() =>
          config.clickCallback !== undefined
            ? config.clickCallback(config.provider, 'DataValue')
            : () => {}
        }>
        {config.value === undefined ? (
          <SkeletonWithTooltip
            text={`Loading ${config.provider?.name} ${toShortString(
              config.dataType
            )}...`}
          />
        ) : (
          <AnimatedTypography
            animationClassName='animated-cell'
            standard={tableCellTypographyStandard}
            child={numberFormat(config.value).toString()}
            durationMs={1000}
          />
        )}
      </td>
    </React.Fragment>
  )
}
