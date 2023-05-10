import { Text } from '@mantine/core'
import { useState } from 'react'

export function LivePSPartial(props: { width: number }) {
  const [tps, setTPS] = useState(0)
  return (
    <>
      <Text>{tps} TPS</Text>
    </>
  )
}
