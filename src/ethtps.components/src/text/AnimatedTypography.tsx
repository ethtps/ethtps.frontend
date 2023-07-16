import { Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

interface IAnimatedTypographyConfiguration {
  child: JSX.Element | string | number
  animationClassName: string
  baseClass: string
  durationMs: number
  sx?: any
  centerText?: boolean
}

export function AnimatedTypography(
  {
    animationClassName = 'animated-cell',
    centerText = false,
    durationMs = 1000,
    sx,
    baseClass,
    child
  }: Partial<IAnimatedTypographyConfiguration>
): JSX.Element {
  const [animated, setAnimated] = useState(false)
  useEffect(() => {
    setAnimated(true)
    const timeout = setTimeout(() => {
      setAnimated(false)
    }, durationMs)
    return () => {
      clearTimeout(timeout)
    }
  }, [child])
  return (
    <>
      <Text
        {...sx}
        className={`${baseClass} ` + (animated ? animationClassName : undefined)}
        textAlign={centerText ? 'center' : undefined}>
        {child}
      </Text>
    </>
  )
}
