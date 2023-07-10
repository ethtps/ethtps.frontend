import { useEffect, useState } from 'react'

/**
 * Returns a hook representing the speed in px/s for a vertical scrolling animation
 * @param duration
 * @param height
 * @returns
 */
export function useVerticalScrolling(duration: number, height?: number) {
    const [speed, setSpeed] = useState(0)
    useEffect(() => {
        setSpeed((height ?? 0) / (duration / 1000))
    }, [height, duration])
    return speed
}