import React, { useEffect } from 'react'
import { CurrentViewersIcon } from '../../CurrentViewersIcon'
import { IDataModeButtonGroupConfiguration } from './IDataModeButtonGroupConfiguration'
import { useHandler } from '@/data'
import { conditionalRender, useColors } from '@/services'
import { Box, Tooltip, Text, ModalFooter, useEditable } from '@chakra-ui/react'
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
      <Box sx={{ float: 'right' }}>
        <Tooltip
          hasArrow
          placement={'auto'}
          label={<Text>Transactions per second</Text>}>
          <IconButton
            sx={
              { ...getColorComparedTo(DataType.Tps) }
            }
            onClick={() => mode?.setter(DataType.Tps)}
            icon={<IconNumber />}
          />
        </Tooltip>

        <Tooltip
          hasArrow
          placement={'auto'}
          {...getColorComparedTo(DataType.Gps)}
          label={<Text>Gas per second</Text>}>
          <IconButton
            sx={
              { ...getColorComparedTo(DataType.Gps) }
            }
            onClick={() => mode?.setter(DataType.Gps)}
            icon={<IconGasStation />}
          />
        </Tooltip>

        <Tooltip
          hasArrow
          placement={'auto'}
          {...getColorComparedTo(DataType.GasAdjustedTps)}
          label={<Text>Gas-adjusted transactions per second</Text>}>
          <IconButton
            sx={
              { ...getColorComparedTo(DataType.GasAdjustedTps) }
            }
            onClick={() => mode?.setter(DataType.GasAdjustedTps)}
            icon={<IconRazorElectric />}
          />
        </Tooltip>
      </Box>
    </>
  )
}
