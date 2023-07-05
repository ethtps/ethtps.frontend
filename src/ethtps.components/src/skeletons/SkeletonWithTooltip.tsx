import { useState } from 'react'
import { ISkeletonWithTooltipConfiguration } from './ISkeletonWithTooltipConfiguration'
import React from 'react'
import { conditionalRender } from '@/services'
import { Box, Skeleton, Tooltip, Text } from '@chakra-ui/react'

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
      <>
        {conditionalRender(
          <Tooltip
            hasArrow
            placement={'bottom-start'}
            label={<><Text>{message}</Text></>}>
            <>
              <Box sx={{ width: '90%' }}>
                <Tooltip label={"Not available"}>
                  -
                </Tooltip>
              </Box>
            </>
          </Tooltip>,
          !delay
        )}
      </>
    </>
  )
}
