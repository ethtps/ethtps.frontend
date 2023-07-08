import { motion } from "framer-motion"
import { ReactElement, useState } from "react"
import { BackgroundFadeText, NextPageWithLayout } from "../../../.."
import styles from './FullScreenLoadingAnimation.module.css'

// Combined animations by @jkantner and @kumarsidharth
interface IFullScreenLoadingAnimationProps {
    sx?: any
    text: string | JSX.Element
    durationSeconds: number
}

const Page: NextPageWithLayout = () => {
    return <p>hello world</p>
}
Page.getLayout = function getLayout(page: ReactElement) {
    return (
        <>
            {page}
        </>
    )
}

export function FullScreenLoadingAnimation({
    sx,
    text,
    durationSeconds
}: IFullScreenLoadingAnimationProps) {
    const [shownText, setShownText] = useState(text)
    const [animationEnded, setAnimationEnded] = useState(false)
    return <div>
        <motion.div
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            className={styles.anicontainer}>
            <div className={styles.hexagon} aria-label="Animated hexagonal ripples">
                <div className={styles.hexagon__group}>
                    <div className={styles.hexagon__sector}></div>
                    <div className={styles.hexagon__sector}></div>
                    <div className={styles.hexagon__sector}></div>
                    <div className={styles.hexagon__sector}></div>
                    <div className={styles.hexagon__sector}></div>
                    <div className={styles.hexagon__sector}></div>
                </div>
                <div className={styles.hexagon__group}>
                    <div className={styles.hexagon__sector}></div>
                    <div className={styles.hexagon__sector}></div>
                    <div className={styles.hexagon__sector}></div>
                    <div className={styles.hexagon__sector}></div>
                    <div className={styles.hexagon__sector}></div>
                    <div className={styles.hexagon__sector}></div>
                </div>
                <div className={styles.hexagon__group}>
                    <div className={styles.hexagon__sector}></div>
                    <div className={styles.hexagon__sector}></div>
                    <div className={styles.hexagon__sector}></div>
                    <div className={styles.hexagon__sector}></div>
                    <div className={styles.hexagon__sector}></div>
                    <div className={styles.hexagon__sector}></div>
                </div>
                <div className={styles.hexagon__group}>
                    <div className={styles.hexagon__sector}></div>
                    <div className={styles.hexagon__sector}></div>
                    <div className={styles.hexagon__sector}></div>
                    <div className={styles.hexagon__sector}></div>
                    <div className={styles.hexagon__sector}></div>
                    <div className={styles.hexagon__sector}></div>
                </div>
                <div className={styles.hexagon__group}>
                    <div className={styles.hexagon__sector}></div>
                    <div className={styles.hexagon__sector}></div>
                    <div className={styles.hexagon__sector}></div>
                    <div className={styles.hexagon__sector}></div>
                    <div className={styles.hexagon__sector}></div>
                    <div className={styles.hexagon__sector}></div>
                </div>
                <div className={styles.hexagon__group}>
                    <div className={styles.hexagon__sector}></div>
                    <div className={styles.hexagon__sector}></div>
                    <div className={styles.hexagon__sector}></div>
                    <div className={styles.hexagon__sector}></div>
                    <div className={styles.hexagon__sector}></div>
                    <div className={styles.hexagon__sector}></div>
                </div>
            </div>
            <BackgroundFadeText durationSeconds={durationSeconds} text={text} />
        </motion.div>
    </div>
}