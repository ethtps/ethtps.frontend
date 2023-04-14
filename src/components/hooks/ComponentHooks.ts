import { useRef, useEffect, useState, MutableRefObject } from "react"
import { IComponentSize } from "../IComponentSize"
import { useViewportSize } from "@mantine/hooks"

export interface ISizeRef extends IComponentSize {
    ref: MutableRefObject<any>
}

/* 
* This is a custom hook that returns a ref and the width and height of the element that the ref is attached to. 
*/
export const useSizeRef = () => {
    const [containerWidth, setContainerWidth] = useState(0)
    const [containerHeight, setContainerHeight] = useState(0)

    const containerRef = useRef<any>(null)
    useEffect(() => {
        setContainerWidth(
            containerRef.current ? containerRef.current.offsetWidth : 0
        )
    }, [containerRef])
    useEffect(() => {
        setContainerHeight(
            containerRef.current ? containerRef.current.offsetHeight : 0
        )
    }, [containerRef])

    return {
        ref: containerRef,
        width: containerWidth,
        height: containerHeight
    } as ISizeRef
}

export const useViewportRatio = () => {
    const [ratio, setRatio] = useState(0)
    const { height, width } = useViewportSize();
    useEffect(() => {
        setRatio(width / height)
    }, [height, width])
    return ratio
}