import { DataPoint, DataType } from '@/api-client'
import {
  IDataModel,
  getMaxDataFor,
  numberFormat
} from '@/data'
import { useColors } from '@/services'
import { Td, Text, Tooltip } from '@chakra-ui/react'
import moment from 'moment'
import {
  ICustomCellConfiguration,
  buildClassNames
} from './ICustomCellConfiguration'
import { tableCellTypographyStandard } from './Typography.types'

function generateMaxHoverMessage(data?: DataPoint): string {
  if (
    data === undefined ||
    (data?.blockNumber === undefined && data?.date === undefined) ||
    data?.blockNumber === 0 ||
    moment(data?.date).year() === undefined ||
    moment(data?.date).year() === 1
  ) {
    return ''
  }

  if (data?.blockNumber !== undefined && data?.blockNumber !== 0) {
    return `Seen at block ${numberFormat(data?.blockNumber ?? 0).toString()}`
  }

  return `Seen ${moment(data?.date)}`
}

function generateMaxTypography(data?: DataPoint) {
  const message = generateMaxHoverMessage(data)
  return message?.length > 0 ? <Text>{message}</Text> : undefined
}

interface IMaxValueCellProps extends ICustomCellConfiguration {
  maxData: IDataModel
  dataType: DataType
}
export function MaxValueCell(config: Partial<IMaxValueCellProps>) {
  const max = getMaxDataFor(config.maxData, config.provider?.name, config.dataType)
  const tooltipTypography = generateMaxTypography(max)
  const colors = useColors()
  return (
    <>
      <Td
        {...buildClassNames(config)}
        textColor={colors.text}
        textAlign={'center'}
        onClick={() =>
          config.clickCallback !== undefined
            ? config.clickCallback(config.provider, 'MaxValue')
            : () => { }
        } >
        <Tooltip hasArrow label={tooltipTypography}>
          <Text
            className={'boldcell'}
            {...tableCellTypographyStandard}
            sx={{
              textDecoration:
                tooltipTypography !== undefined ? 'underline' : undefined
            }}>
            {numberFormat(max?.value).toString()}
          </Text>
        </Tooltip>
      </Td>
    </>
  )
}
