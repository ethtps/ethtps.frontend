import { Text } from '@chakra-ui/react'
import React from 'react'

interface IAnimatedTypographyConfiguration {
  child: JSX.Element | string
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
        sx={{ fontSize: '1rem', fontWeight: 'bold' }}
        className={config.animationClassName}
        key={config.child.toString()}
        textAlign={config.centerText ? 'center' : undefined}>
        {config.child}
      </Text>
    </>
  )
}
