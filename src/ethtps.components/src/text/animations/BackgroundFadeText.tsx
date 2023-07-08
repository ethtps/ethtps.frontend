import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface IBackgroundFadeTextProps {
    sx?: any
    text: string | JSX.Element
    durationSeconds: number
}

export function BackgroundFadeText({ sx, text, durationSeconds }: IBackgroundFadeTextProps) {
    const [displayedText, setDisplayedText] = useState(text)
    const [opacity, setOpacity] = useState(0)
    useEffect(() => {
        if (text === displayedText) return
        setOpacity(0)
        setTimeout(() => {
            setDisplayedText(text)
            setOpacity(1)
        }, durationSeconds * 1000 / 2)
    }, [text])
    return <>
        <motion.div
            transition={{ duration: durationSeconds / 2 }}
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: opacity,
            }}>
            <div style={{ minHeight: "1rem" }}>
                {displayedText}
            </div>
        </motion.div>
    </>
}