import { DataType } from '@/api-client'
import { AnimatedTypography } from '@/components'
import { LiveDataAggregator, numberFormat } from '@/data'
import { Td } from '@chakra-ui/react'
import { ICustomCellConfiguration } from './ICustomCellConfiguration'
import { tableCellTypographyStandard } from './Typography.types'

interface IDataValueCellConfiguration extends ICustomCellConfiguration {
  dataType: DataType
  aggregator?: LiveDataAggregator
  initialValue?: number
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
        <AnimatedTypography
          animationClassName='animated-cell'
          sx={tableCellTypographyStandard}
          child={numberFormat(v ?? config.initialValue).toString()}
          durationMs={1000}
        />
      </Td>
    </>
  )
}
