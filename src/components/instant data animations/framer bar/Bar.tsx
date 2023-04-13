import { IComponentSize } from "@/components";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";

interface IBarProps extends IComponentSize {
    x?: number;
    y?: number;
    ref?: React.RefObject<any>;
}

export function Bar(props: IBarProps) {
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const moveRandomly = useCallback(() => {
        setX(Math.random() * (props.width ?? 200))
        setY(Math.random() * (props.height ?? 200))
    }, [props.width, props.height])
    return <>
        <motion.div
            onMouseEnter={moveRandomly}
            style={{
                height: props.height,
                width: props.width,
                paddingTop: 10,
                paddingBottom: 10,
                backgroundColor: "purple",
            }}
            animate={{ scaleX: Math.random() }} />
    </>
}