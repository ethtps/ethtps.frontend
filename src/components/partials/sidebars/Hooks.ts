import { useViewportSize } from "@mantine/hooks"
import { useState, useEffect } from "react"

const hiddenSize = 1100

export const useAutoHideSidebar = () => {
    const size = useViewportSize()
    const [hideSidebar, setHideSidebar] = useState(size.width < hiddenSize)
    useEffect(() => {
        if (size.width < hiddenSize) {
            setHideSidebar(true)
        } else {
            setHideSidebar(false)
        }
    }, [size])
    return hideSidebar
}