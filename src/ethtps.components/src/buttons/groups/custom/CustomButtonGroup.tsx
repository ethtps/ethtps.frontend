
import { Button, HStack, Tooltip } from '@chakra-ui/react'
import { useState } from 'react'
import { useColors } from '../../../..'
import { ICustomButtonGroupParameters } from './ICustomButtonGroupParameters'

export function CustomButtonGroup(params: ICustomButtonGroupParameters) {
  const colors = useColors()
  const [currentSelected, setCurrentSelected] = useState<string | undefined>(params.selected)
  return (
    <>
      <HStack aria-label='outlined primary button group'>
        {params?.buttons?.map((x, i) => (
          <Tooltip
            key={`ttt-${i}`}
            label={params.tooltipFunction?.(x)}>
            <Button
              {...params.props}
              sx={{
                ...params.sx,
                ...(currentSelected === x ? { bg: (params.highlighed === x ? colors.secondary : colors.secondary), color: 'black' } : {})
              }}
              onClick={() => {
                setCurrentSelected(x)
                params.onChange?.(x)
              }}
              key={i}>{x}</Button>
          </Tooltip>
        ))}
      </HStack>
    </>
  )
}
