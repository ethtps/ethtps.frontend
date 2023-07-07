
import { Box, Button, Tooltip } from '@chakra-ui/react'
import {
  IconGasStation,
  IconNumber,
  IconRazorElectric
} from '@tabler/icons-react'
import { ETHTPSDataCoreDataType } from 'ethtps.api'
import { useColors } from '../../../..'
import { useHandler } from '../../../../../ethtps.data/src'
import { IDataModeButtonGroupConfiguration } from './IDataModeButtonGroupConfiguration'

export function DataModeButtonGroup(model: IDataModeButtonGroupConfiguration): JSX.Element {
  const mode = useHandler(model.modeHandle)
  const colors = useColors()
  const getColorComparedTo = (proposedMode: ETHTPSDataCoreDataType) =>
    proposedMode == mode?.value ? { color: colors.primary } : undefined
  return (
    <>
      <Box sx={{ float: model.float ?? 'right' }}>
        <Tooltip
          hasArrow
          placement={'auto'}
          title={'Display transactions per second'}>
          <Button
            variant={'ghost'}
            sx={
              { ...getColorComparedTo(ETHTPSDataCoreDataType.TPS) }
            }
            onClick={() => mode?.setter(ETHTPSDataCoreDataType.TPS)}
            leftIcon={<IconNumber />}
          />
        </Tooltip>

        <Tooltip
          hasArrow
          placement={'auto'}
          {...getColorComparedTo(ETHTPSDataCoreDataType.GPS)}
          title={'Display gas per second'}>
          <Button
            variant={'ghost'}
            sx={
              { ...getColorComparedTo(ETHTPSDataCoreDataType.GPS) }
            }
            onClick={() => mode?.setter(ETHTPSDataCoreDataType.GPS)}
            leftIcon={<IconGasStation />}
          />
        </Tooltip>

        <Tooltip
          hasArrow
          placement={'auto'}
          {...getColorComparedTo(ETHTPSDataCoreDataType.GAS_ADJUSTED_TPS)}
          title={'Display gas-adjusted transactions per second'}>
          <Button
            variant={'ghost'}
            sx={
              { ...getColorComparedTo(ETHTPSDataCoreDataType.GAS_ADJUSTED_TPS) }
            }
            onClick={() => mode?.setter(ETHTPSDataCoreDataType.GAS_ADJUSTED_TPS)}
            leftIcon={<IconRazorElectric />}
          />
        </Tooltip>
      </Box>
    </>
  )
}
