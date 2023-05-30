'use client'
//import { VISXStreamChart } from '@/components/'
import { useColors } from '@/services'
import { Progress } from '@chakra-ui/react'

export function LivePSPartial(props: { width: number, value: number }) {
  const colors = useColors()
  return (
    <>
      <svg width={props.width} height={500}>
        <rect width={props.width} height={500} fill={colors.secondary} rx={14} />
      </svg>
    </>
  )
}
//<VISXStreamChart width={props.width} height={500} />