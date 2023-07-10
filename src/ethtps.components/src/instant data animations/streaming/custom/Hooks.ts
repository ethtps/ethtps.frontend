import { useEffect, useState } from 'react'

export function useVerticalScrolling(duration: number, height?: number) {
    const [speed, setSpeed] = useState(0)
    useEffect(() => {
        setSpeed((height ?? 0) / (duration / 1000))
    }, [height, duration])
    return speed
}