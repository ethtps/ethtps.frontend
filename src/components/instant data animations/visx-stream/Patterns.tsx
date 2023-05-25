import React, { FC } from "react"
import { PatternCircles, PatternWaves } from '@visx/pattern'

export const Patterns: FC = () => (
    <>
        <PatternCircles id="mustard" height={40} width={40} radius={5} fill="#036ecf" complement />
        <PatternWaves
            id="cherry"
            height={12}
            width={12}
            fill="transparent"
            stroke="#232493"
            strokeWidth={1}
        />
        <PatternCircles id="navy" height={60} width={60} radius={10} fill="white" complement />
        <PatternCircles
            complement
            id="circles"
            height={60}
            width={60}
            radius={10}
            fill="transparent"
        />
    </>
)