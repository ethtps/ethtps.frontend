import moment from 'moment'
import React from 'react'
import {
  ICustomCellConfiguration,
  buildClassNames
} from './ICustomCellConfiguration'
import { tableCellTypographyStandard } from './Typography.types'
import { Tooltip } from '@mantine/core'
import { Text } from '@mantine/core'
import { DataPoint } from '@/api-client'
import {
  numberFormat,
  useGetLiveDataModeFromAppStore,
  useGetMaxDataForProviderFromAppStore
} from '@/data'

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
  const type = useGetLiveDataModeFromAppStore()
  const maxData = useGetMaxDataForProviderFromAppStore(
    config.provider?.name as string,
    type
  )
  const tooltipTypography = generateMaxTypography(maxData)
  return (
    <>
      <td
        {...buildClassNames(config)}
        onClick={() =>
          config.clickCallback !== undefined
            ? config.clickCallback(config.provider, 'MaxValue')
            : () => { }
        }>
        <Tooltip withArrow label={tooltipTypography}>
          <>
            <Text
              className={'boldcell'}
              {...tableCellTypographyStandard}
              sx={{
                textDecoration:
                  tooltipTypography !== undefined ? 'underline' : undefined
              }}>
              {numberFormat(maxData?.value).toString()}
            </Text>
          </>
        </Tooltip>
      </td>
    </>
  )
}
