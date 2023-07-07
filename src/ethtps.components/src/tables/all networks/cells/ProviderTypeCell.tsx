
import { Td, Text } from '@chakra-ui/react'
import { ICustomCellConfiguration } from '..'
import { useColors } from '../../../..'

export function ProviderTypeCell(config: ICustomCellConfiguration): JSX.Element {
  const colors = useColors()
  return (
    <>
      <Td
        minW={'200px'}
        textColor={colors.text}
        onClick={() =>
          config.clickCallback !== undefined
            ? config.clickCallback(config.provider, 'ProviderType')
            : () => { }
        } >
        <Text className={'boldcell'}>{config.provider?.type}</Text>
      </Td>
    </>
  )
}
