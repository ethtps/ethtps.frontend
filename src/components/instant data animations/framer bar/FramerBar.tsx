import { IComponentSize } from "@/components";
import { motion, transform, useMotionValue, useTransform } from "framer-motion";
import { useCallback, useState } from "react";
import { Bar } from "./Bar";
import { Group } from "@mantine/core";

enum States {
    connecting,
    connected,
    disconnected,
    reconnecting
}

interface IFramerBarProps extends IComponentSize {

}

export function FramerBar(props: IFramerBarProps) {
    return <>
        <motion.div style={{
            width: props.width,
            height: props.height,
        }}>
            <Group>
                <Bar width={100} height={props.height} />
                <Bar width={100} height={props.height} />
            </Group>
        </motion.div>
    </>
}