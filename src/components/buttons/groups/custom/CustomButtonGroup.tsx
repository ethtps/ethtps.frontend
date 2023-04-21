import React from 'react'
import { ICustomButtonGroupParameters } from './ICustomButtonGroupParameters'
import { Button, Group } from '@mantine/core'

export function CustomButtonGroup(params: ICustomButtonGroupParameters) {
  return (
    <>
      <Group aria-label='outlined primary button group'>
        {params?.buttons?.map((x, i) => (
          <Button key={i}>{x}</Button>
        ))}
      </Group>
    </>
  )
}
