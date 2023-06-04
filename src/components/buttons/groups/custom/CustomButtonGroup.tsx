import React, { useState } from 'react'
import { ICustomButtonGroupParameters } from './ICustomButtonGroupParameters'
import { Button, HStack, Stack, Tooltip } from '@chakra-ui/react'
import { useColors } from '@/services'

export function CustomButtonGroup(params: ICustomButtonGroupParameters) {
  const colors = useColors()
  const [currentSelected, setCurrentSelected] = useState<string | undefined>(params.selected)
  return (
    <>
      <HStack aria-label='outlined primary button group'>
        {params?.buttons?.map((x, i) => (
          <Tooltip key={`ttt-${i}`} label={params.tooltipFunction?.(x)}>
            <Button
              {...params.props}
              sx={{
                ...params.sx,
                ...(currentSelected === x ? { bg: colors.secondary, color: 'black' } : {})
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
