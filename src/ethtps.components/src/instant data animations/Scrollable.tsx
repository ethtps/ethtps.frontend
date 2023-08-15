import { ForwardRefComponent, SVGMotionProps, motion, useWillChange } from "framer-motion"
import { useRef } from "react"
import { logToOverlay } from "../../../ethtps.data/src"

interface ScrollOptions {
  direction: 'left' | 'right',
  scrollTimeSeconds: number,
  children?: React.ReactNode,
  scrollWidth: number,
  pause?: boolean
}

export function ScrollableG({
  children,
  direction,
  scrollTimeSeconds,
  scrollWidth,
  pause
}: ScrollOptions) {
  const x = useWillChange()
  logToOverlay({
    name: 'ScrollableG',
    details: JSON.stringify({
      direction,
      scrollTimeSeconds,
      scrollWidth,
      pause
    })
  })
  return <motion.g
    width={scrollWidth}
    style={{
      x,
      translateZ: 0, // Force HArdware acceleration
    }}
    animate={{
      x: direction === 'left' ? -scrollWidth : scrollWidth
    }}
    transition={{
      repeat: Infinity,
      type: 'keyframes',
      duration: !!!pause ? scrollTimeSeconds : Infinity,
    }}>
    {children}
  </motion.g>
}