import React, { useEffect } from 'react'
import { CurrentViewersIcon } from '../../CurrentViewersIcon'
import { IDataModeButtonGroupConfiguration } from './IDataModeButtonGroupConfiguration'
import { useHandler } from '@/data'
import { conditionalRender, useColors } from '@/services'
import { Box, Tooltip, Text, ModalFooter, useEditable, Button } from '@chakra-ui/react'
import { IconButton } from '../../IconButton'
import {
  IconGasStation,
  IconNumber,
  IconRazorElectric
} from '@tabler/icons-react'
import { DataType } from '@/api-client'

export function DataModeButtonGroup(model: IDataModeButtonGroupConfiguration) {
  const mode = useHandler(model.modeHandle)
  const colors = useColors()
  const getColorComparedTo = (proposedMode: DataType) =>
    proposedMode == mode?.value ? { color: colors.primary } : undefined
  return (
    <>
      <Box sx={{ float: model.float ?? 'right' }}>
        <Tooltip
          hasArrow
          placement={'auto'}
          label={'Display transactions per second'}>
          <Button
            variant={'ghost'}
            sx={
              { ...getColorComparedTo(DataType.Tps) }
            }
            onClick={() => mode?.setter(DataType.Tps)}
            leftIcon={<IconNumber />}
          />
        </Tooltip>

        <Tooltip
          hasArrow
          placement={'auto'}
          {...getColorComparedTo(DataType.Gps)}
          label={'Display gas per second'}>
          <Button
            variant={'ghost'}
            sx={
              { ...getColorComparedTo(DataType.Gps) }
            }
            onClick={() => mode?.setter(DataType.Gps)}
            leftIcon={<IconGasStation />}
          />
        </Tooltip>

        <Tooltip
          hasArrow
          placement={'auto'}
          {...getColorComparedTo(DataType.GasAdjustedTps)}
          label={'Display gas-adjusted transactions per second'}>
          <Button
            variant={'ghost'}
            sx={
              { ...getColorComparedTo(DataType.GasAdjustedTps) }
            }
            onClick={() => mode?.setter(DataType.GasAdjustedTps)}
            leftIcon={<IconRazorElectric />}
          />
        </Tooltip>
      </Box>
    </>
  )
}
