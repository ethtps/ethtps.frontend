import { useRef, useEffect, useState, MutableRefObject } from 'react'
import { IComponentSize } from '../IComponentSize'
import { useElementSize, useViewportSize } from '@mantine/hooks'

export interface ISizeRef extends IComponentSize {
  ref: MutableRefObject<any>
}

/*
 * This is a custom hook that returns a ref and the width and height of the element that the ref is attached to.
 */
export const useSizeRef = () => {
  const { ref, width, height } = useElementSize();
  return { ref, width, height } as ISizeRef
}

export const useViewportRatio = () => {
  const [ratio, setRatio] = useState(0)
  const { height, width } = useViewportSize()
  useEffect(() => {
    setRatio(width / height)
  }, [height, width])
  return ratio
}
