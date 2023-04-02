import moment from 'moment'
import React from 'react'
import { centered } from '../../Cells.Types'
import {
  ICustomCellConfiguration,
  buildClassNames
} from './ICustomCellConfiguration'
import { tableCellTypographyStandard } from './Typography.types'
import { DataPoint, numberFormat, liveDataHooks } from '@/data/src'
import { useGetMaxDataForProviderFromAppStore } from '@/data/src/hooks/DataHooks'
import { Tooltip } from '@mantine/core'
import { Text } from '@mantine/core'

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

export function MaxValueCell(config: ICustomCellConfiguration) {
  const type = liveDataHooks.useGetLiveDataModeFromAppStore()
  const maxData = useGetMaxDataForProviderFromAppStore(
    config.provider?.name as string,
    type
  )
  const tooltipTypography = generateMaxTypography(maxData)
  return (
    <React.Fragment>
      <td
        {...buildClassNames(config)}
        onClick={() =>
          config.clickCallback !== undefined
            ? config.clickCallback(config.provider, 'MaxValue')
            : () => {}
        }>
        <Tooltip withArrow label={tooltipTypography}>
          <Text
            {...tableCellTypographyStandard}
            sx={{
              textDecoration:
                tooltipTypography !== undefined ? 'underline' : undefined
            }}>
            {numberFormat(maxData?.value).toString()}
          </Text>
        </Tooltip>
      </td>
    </React.Fragment>
  )
}
