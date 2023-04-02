import { useState } from 'react'
import { ISkeletonWithTooltipConfiguration } from './ISkeletonWithTooltipConfiguration'
import React from 'react'
import { conditionalRender } from '@/services'
import { Box, Skeleton, Tooltip, Text } from '@mantine/core'

export function SkeletonWithTooltip(config: ISkeletonWithTooltipConfiguration) {
  const message = config.text ?? 'Loading...'
  const [delay, setDelay] = useState(config.randomDelay)
  if (config.randomDelay !== undefined) {
    if (config.randomDelay === true) {
      setTimeout(() => setDelay(false), Math.random() * 250)
    }
  }
  return (
    <>
      <React.Fragment>
        {conditionalRender(
          <Tooltip withArrow label={<Text>{message}</Text>}>
            <Box sx={{ width: '90%' }}>
              <Skeleton
                className={'w-hundred'}
                variant={
                  config.rectangular ? 'rectangular' : undefined
                }></Skeleton>
            </Box>
          </Tooltip>,
          !delay
        )}
      </React.Fragment>
    </>
  )
}
