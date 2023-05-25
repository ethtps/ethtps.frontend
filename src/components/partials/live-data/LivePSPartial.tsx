import { Text } from '@chakra-ui/react'
import { useState } from 'react'

export function LivePSPartial(props: { width: number, value: number }) {
  return (
    <>
      <Text>{props.value} TPS</Text>
    </>
  )
}
