import React, { useState } from 'react'
import { animated, useSpring } from '@react-spring/web'
import { colorScale, patternScale } from './Scales'


type StackItemProps = {
    stack: any,
    path: any,
    animate: boolean,
    hovered: boolean,
    handleMouseEnter: () => void,
    handleMouseLeave: () => void,
    handleTouchStart: () => void,
    handleTouchEnd: () => void
}

const StackItem: React.FC<StackItemProps> = ({
    stack,
    path,
    animate,
    hovered,
    handleMouseEnter,
    handleMouseLeave,
    handleTouchStart,
    handleTouchEnd
}) => {
    const pathString = path(stack) || ''
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const tweened = animate ? useSpring({ pathString }) : { pathString }
    const color = colorScale(stack.key)
    const pattern = patternScale(stack.key)

    return (
        <g
            key={`series-${stack.key}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{
                opacity: hovered ? 1 : 0.1,
                transition: 'opacity 0.5s ease'
            }}
        >
            <animated.path d={tweened.pathString} fill={color} />
            <animated.path d={tweened.pathString} fill={`url(#${pattern})`} />
        </g>
    )
}


type StreamStackProps = {
    stacks: any[],
    path: any,
    animate: boolean
}

export const StreamStack: React.FC<StreamStackProps> = ({ stacks, path, animate }) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    const handleHoverStart = (index: number) => {
        setHoveredIndex(index)
    }

    const handleHoverEnd = () => {
        setHoveredIndex(null)
    }

    return (
        <>
            {stacks.map((stack, index) => (
                <StackItem
                    key={`stack-${index}`}
                    stack={stack}
                    path={path}
                    animate={animate}
                    hovered={hoveredIndex !== null ? index === hoveredIndex : true}
                    handleMouseEnter={() => handleHoverStart(index)}
                    handleMouseLeave={handleHoverEnd}
                    handleTouchStart={() => handleHoverStart(index)}
                    handleTouchEnd={handleHoverEnd}
                />
            ))}
        </>
    )
}