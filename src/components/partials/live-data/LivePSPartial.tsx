import { VISXStreamChart } from '@/components/'
import { NonSSRWrapper } from '@/components'
import { Text } from '@chakra-ui/react'
import { useState } from 'react'

export function LivePSPartial(props: { width: number, value: number }) {
  return (
    <>
      <VISXStreamChart width={props.width} height={500} />
      <NonSSRWrapper>
      </NonSSRWrapper>
    </>
  )
}
