import React from 'react'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import { EvStation, LocalGasStation, Numbers } from '@mui/icons-material'
import { CurrentViewersIcon } from '../../CurrentViewersIcon'
import { IDataModeButtonGroupConfiguration } from './IDataModeButtonGroupConfiguration'
import { useHandler } from '@/data/src'
import { DataType } from '@/api-client/src/models'
import { conditionalRender, useAppSelector } from '@/services'

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
          arrow
          placement={'top'}
          {...getColorComparedTo(DataType.Tps)}
          title={<Typography>Transactions per second</Typography>}>
          <IconButton onClick={() => mode?.setter(DataType.Tps)}>
            <Numbers />
          </IconButton>
        </Tooltip>

        <Tooltip
          arrow
          placement={'top'}
          {...getColorComparedTo(DataType.Gps)}
          title={<Typography>Gas per second</Typography>}>
          <IconButton onClick={() => mode?.setter(DataType.Gps)}>
            <LocalGasStation />
          </IconButton>
        </Tooltip>

        <Tooltip
          arrow
          placement={'top'}
          {...getColorComparedTo(DataType.GasAdjustedTps)}
          title={<Typography>Gas-adjusted transactions per second</Typography>}>
          <IconButton onClick={() => mode?.setter(DataType.GasAdjustedTps)}>
            <EvStation />
          </IconButton>
        </Tooltip>
      </Box>
    </React.Fragment>
  )
}
