import { animated, useSpring } from "@react-spring/web"
import React from "react"
import { FC } from "react"
import { colorScale, patternScale } from "./Scales"

export const StreamStack: FC<{ stacks: any[], path: any, animate: boolean }> = ({ stacks, path, animate }) => {
    return (
        <>
            {stacks.map((stack) => {
                const pathString = path(stack) || ''
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const tweened = animate ? useSpring({ pathString }) : { pathString }
                const color = colorScale(stack.key)
                const pattern = patternScale(stack.key)
                return (
                    <g key={`series-${stack.key}`}>
                        <animated.path d={tweened.pathString} fill={color} />
                        <animated.path d={tweened.pathString} fill={`url(#${pattern})`} />
                    </g>
                )
            })}
        </>
    )
}