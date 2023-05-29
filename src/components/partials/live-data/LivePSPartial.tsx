'use client'
import { VISXStreamChart } from '@/components/'

export function LivePSPartial(props: { width: number, value: number }) {
  return (
    <>
      <VISXStreamChart width={props.width} height={500} />
    </>
  )
}
