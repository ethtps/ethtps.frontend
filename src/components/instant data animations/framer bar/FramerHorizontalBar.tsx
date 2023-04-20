import { IComponentSize } from '@/components'
import { motion, transform, useMotionValue, useTransform } from 'framer-motion'
import { useCallback, useState } from 'react'
import { ProviderBar } from './ProviderBar'
import { Group } from '@mantine/core'
import { LoadingAnimation } from './LoadingAnimation'

enum States {
  connecting,
  connected,
  disconnected,
  reconnecting
}

export enum Direction {
  horizontal,
  vertical
}

export interface IFramerHorizontalBarProps extends IComponentSize { }
export function FramerHorizontalBar(props: IFramerHorizontalBarProps) {
  return (
    <>
      <motion.div
        style={{
          width: props.width,
          height: props.height,
          overflow: 'hidden',
          backgroundColor: '#37367b'
        }}>
        <LoadingAnimation />
      </motion.div>
    </>
  )
}