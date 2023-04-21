import { ICustomCellConfiguration } from './ICustomCellConfiguration'
import { tableCellTypographyStandard } from './Typography.types'
import React from 'react'
import { m_toShortString, numberFormat, toShortString } from '@/data'
import { AnimatedTypography, SkeletonWithTooltip } from '@/components'
import { DataType } from '@/api-client'

interface IDataValueCellConficuration extends ICustomCellConfiguration {
  value?: number
  dataType: DataType
}

export function DataValueCell(config: IDataValueCellConficuration) {
  return (
    <>
      <td
        onClick={() =>
          config.clickCallback !== undefined
            ? config.clickCallback(config.provider, 'DataValue')
            : () => { }
        }>
        {config.value === undefined ? (
          <SkeletonWithTooltip
            text={`Loading ${config.provider?.name} ${m_toShortString(
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
    </>
  )
}
