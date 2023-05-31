import { Text } from '@chakra-ui/react'
import React from 'react'

interface IAnimatedTypographyConfiguration {
  child: JSX.Element | string | number
  animationClassName: string
  durationMs: number
  standard?: any
  centerText?: boolean
}

export function AnimatedTypography(config: IAnimatedTypographyConfiguration) {
  return (
    <>
      <Text
        {...config.standard}
        className={config.animationClassName}
        key={config.child.toString()}
        textAlign={config.centerText ? 'center' : undefined}>
        {config.child}
      </Text>
    </>
  )
}
