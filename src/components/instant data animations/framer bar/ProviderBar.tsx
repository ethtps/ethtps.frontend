import { IComponentSize } from "@/components";
import { defaultColorDictionary } from "@/data";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";

interface IProviderBarProps extends IComponentSize {
    x?: number;
    y?: number;
    ref?: React.RefObject<any>;
    providerName: string
}

const hoveredExtraWidth = 200

export function ProviderBar(props: IProviderBarProps) {
    const [xTranslation, setXTranslation] = useState(0)
    const [width, setWidth] = useState(props.width)
    const entered = useCallback(() => {
        setXTranslation(-hoveredExtraWidth / 2)
        setWidth(hoveredExtraWidth)
    }, [])
    const exited = useCallback(() => {
        setXTranslation(0)
        setWidth(props.width)
    }, [props.width])
    return <>
        <motion.div
            onMouseEnter={entered}
            onMouseLeave={exited}
            style={{
                height: props.height,
                width: props.width,
                paddingTop: 10,
                paddingBottom: 10,
                margin: 0,
                backgroundColor: defaultColorDictionary[props.providerName],
            }}
            animate={{ width: width, x: xTranslation }} >
        </motion.div>
    </>
}