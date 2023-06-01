import { ICustomCellConfiguration } from './ICustomCellConfiguration'
import { tableCellTypographyStandard } from './Typography.types'
import React from 'react'
import { LiveDataAggregator, m_toShortString, numberFormat, toShortString } from '@/data'
import { AnimatedTypography, SkeletonWithTooltip } from '@/components'
import { DataType } from '@/api-client'
import { Td } from '@chakra-ui/react'

interface IDataValueCellConfiguration extends ICustomCellConfiguration {
  dataType: DataType
  aggregator?: LiveDataAggregator
}

export function DataValueCell(config: IDataValueCellConfiguration) {
  const value = config.aggregator?.get(config.provider?.name)
  let v: number | undefined
  switch (config.dataType) {
    case DataType.Tps:
      v = value?.data?.tps
      break
    case DataType.GasAdjustedTps:
      if (value?.data?.gps)
        v = value?.data?.gps / 21000
      break
    case DataType.Gps:
      v = value?.data?.gps
      break
  }

  return (
    <>
      <Td
        onClick={() =>
          config.clickCallback !== undefined
            ? config.clickCallback(config.provider, 'DataValue')
            : () => { }
        }
      >
        {v === undefined ? (
          <SkeletonWithTooltip
            text={`Loading ${config.provider?.name} ${m_toShortString(
              config.dataType
            )}...`}
          />
        ) : (
          <AnimatedTypography
            animationClassName='animated-cell'
            sx={tableCellTypographyStandard}
            child={numberFormat(v).toString()}
            durationMs={1000}
          />
        )}
      </Td>
    </>
  )
}
