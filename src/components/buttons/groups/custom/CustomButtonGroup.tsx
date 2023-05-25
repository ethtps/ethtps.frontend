import React from 'react'
import { ICustomButtonGroupParameters } from './ICustomButtonGroupParameters'
import { Button, Stack } from '@chakra-ui/react'

export function CustomButtonGroup(params: ICustomButtonGroupParameters) {
  return (
    <>
      <Stack aria-label='outlined primary button group'>
        {params?.buttons?.map((x, i) => (
          <Button key={i}>{x}</Button>
        ))}
      </Stack>
    </>
  )
}
