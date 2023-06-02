import React, { useEffect, useState } from "react"
import {
    stack,
    area,
    curveBasis,
    stackOrderInsideOut,
    stackOffsetSilhouette,
} from "d3-shape"
import { schemeDark2 } from "d3-scale-chromatic"
import { scaleLinear, scaleOrdinal } from "d3-scale"
import { extent } from "d3-array"
import { Box, Container } from "@chakra-ui/react"
import { SimpleLiveDataStat } from "@/components"
import { useColors } from "@/services"

const Tooltip = ({ opacity, text }) => {
    return (
        <text x={50} y={50} style={{ opacity: opacity, fontSize: 17, fill: "black" }}>
            {text}
        </text>
    )
}

export const D3Stream = ({ data, width, height, newestData }) => {
    // Optional tooltip in top right corner when hovering a stream
    // You could also export the Tooltip to its own file
    const [opacity, setOpacity] = useState(0)
    const [text, setText] = useState("initialState")
    const [stacks, setStacks] = useState([])
    const [liveData, setLiveData] = useState([])
    const [columns, setColumns] = useState([])
    useEffect(() => {
        if (!newestData) return

        setColumns(c => {
            const keys = Object.keys(newestData)
            if (keys?.length === 0) return c

            const newColumns = [...c, ...keys.filter(k => !c.includes(k))]
            setLiveData(l => {
                const dataPoint = {}
                newColumns.forEach(c => dataPoint[c] = newestData[c]?.data.tps)
                return [...l, dataPoint]
            })
            return newColumns
        })
    }, [newestData])
    useEffect(() => {
        if (columns?.length === 0) return

        const keys = columns

        // Color for each category
        const colorScale = scaleOrdinal().domain(keys).range(schemeDark2)

        // Accessor function to get the year and then build scale from it
        const xValue = (d, i) => i
        const xScale = scaleLinear().domain(extent(data, xValue)).range([0, width])

        const yScale = scaleLinear().domain([-30, 30]).range([height, 0])

        // could do some filtering here
        const stackData = liveData

        // Setup the layout of the graph
        const stackLayout = stack()
            .offset(stackOffsetSilhouette)
            .order(stackOrderInsideOut)
            .keys(keys)

        // Using the stackLayout we get two additional components for y0 and y1.
        // For x we want to get the yeaer from the original data, so we have to access d.data
        const stackArea = area()
            .x((d, i) => xScale(i))
            .y0((d) => yScale(d[0]))
            .y1((d) => yScale(-d[0]))
            .curve(curveBasis)

        //Interactivity function #1: Hovering
        const handleMouseover = (d) => {
            setOpacity(1)
        }
        //Interactivity function #2: Moving
        const handleMousemove = (d) => {
            setText(d.key)
        }
        //Interactivity function #3: Leaving
        const handleMouseleave = (d) => {
            setOpacity(0)
            setText("initialState")
        }


        // Generate path elements using React 
        // Mouseovers and opacity are optional for interactivity
        setStacks(stackLayout(stackData).map((d, i) => (
            <path
                key={"stack" + i}
                d={stackArea(d)}
                style={{
                    fill: colorScale(d.key),
                    stroke: "black",
                    strokeOpacity: 0.25,
                    opacity: text === "initialState" || d.key === text ? 1 : 0.2,
                }}
                onMouseOver={() => {
                    handleMouseover(d)
                }}
                onMouseMove={() => {
                    handleMousemove(d)
                }}
                onMouseLeave={() => {
                    handleMouseleave(d)
                }}
            />
        )))
    }, [data, width, height, text, liveData, columns])
    return <svg width={width} height={height}>
        <Tooltip opacity={opacity} text={text} />
        <>{stacks}</>
    </svg>
}
