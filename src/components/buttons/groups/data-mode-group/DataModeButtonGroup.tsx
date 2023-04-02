import React from 'react'
import { CurrentViewersIcon } from '../../CurrentViewersIcon'
import { IDataModeButtonGroupConfiguration } from './IDataModeButtonGroupConfiguration'
import { useHandler } from '@/data/src'
import { DataType } from '@/api-client/src/models'
import { conditionalRender, useAppSelector } from '@/services'
import { Box, Tooltip, Text } from '@mantine/core'
import { IconButton } from '../../IconButton'
import {
  IconGasStation,
  IconNumber,
  IconRazorElectric
} from '@tabler/icons-react'

export function DataModeButtonGroup(model: IDataModeButtonGroupConfiguration) {
  const mode = useHandler(model.modeHandle)
  const getColorComparedTo = (proposedMode: DataType) =>
    proposedMode == mode?.value ? { color: 'primary' } : undefined
  const experimentsAppStoreValue = useAppSelector(
    (state) => state.experiments
  ) as number[] | undefined
  return (
    <React.Fragment>
      <Box sx={{ float: 'right' }}>
        {conditionalRender(
          <CurrentViewersIcon />,
          experimentsAppStoreValue?.includes(5) && false
        )}
        <Tooltip
          withArrow
          position={'top'}
          {...getColorComparedTo(DataType.Tps)}
          label={<Text>Transactions per second</Text>}>
          <IconButton
            onClick={() => mode?.setter(DataType.Tps)}
            icon={<IconNumber />}
          />
        </Tooltip>

        <Tooltip
          withArrow
          position={'top'}
          {...getColorComparedTo(DataType.Gps)}
          label={<Text>Gas per second</Text>}>
          <IconButton
            onClick={() => mode?.setter(DataType.Gps)}
            icon={<IconGasStation />}
          />
        </Tooltip>

        <Tooltip
          withArrow
          position={'top'}
          {...getColorComparedTo(DataType.GasAdjustedTps)}
          label={<Text>Gas-adjusted transactions per second</Text>}>
          <IconButton
            onClick={() => mode?.setter(DataType.GasAdjustedTps)}
            icon={<IconRazorElectric />}
          />
        </Tooltip>
      </Box>
    </React.Fragment>
  )
}
