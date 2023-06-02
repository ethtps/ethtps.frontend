import React, { useEffect, useState } from "react"
import {
    stack,
    area,
    curveBasis,
    curveBumpY,
    curveBasisClosed,
    stackOrderInsideOut,
    stackOffsetSilhouette,
    stackOrderReverse
} from "d3-shape"
import { schemeDark2 } from "d3-scale-chromatic"
import { scaleLinear, scaleOrdinal } from "d3-scale"
import { extent } from "d3-array"
import { Box, Container, Text } from "@chakra-ui/react"
import { SimpleLiveDataStat } from "@/components"
import { binaryConditionalRender, useColors } from "@/services"
import { set } from "date-fns"
import { BeatLoader } from "react-spinners"

const Tooltip = ({ opacity, text }) => {
    return (
        <text x={50} y={50} style={{ opacity: opacity, fontSize: 17, fill: "black" }}>
            {text}
        </text>
    )
}

export const D3Stream = ({ data, width, height, newestData, connected }) => {
    // Optional tooltip in top right corner when hovering a stream
    // You could also export the Tooltip to its own file
    const [opacity, setOpacity] = useState(0)
    const [text, setText] = useState("initialState")
    const [stacks, setStacks] = useState([])
    const [liveData, setLiveData] = useState([])
    const [cumulatedLiveData, setCumulatedLiveData] = useState([])
    const [columns, setColumns] = useState([])
    const [totals, setTotals] = useState([])
    useEffect(() => {
        if (!newestData) return

        setColumns(c => {
            const keys = Object.keys(newestData)
            if (keys?.length === 0) return c

            const newColumns = [...c, ...keys.filter(k => !c.includes(k))]
            setLiveData(l => {
                const dataPoint = {}
                newColumns.forEach(c => dataPoint[c] = newestData[c]?.data.tps)
                setTotals(m => [...m, Object.keys(dataPoint).map(x => dataPoint[x]).reduce((a, b) => (a ?? 0) + (b ?? 0), 0)])

                setCumulatedLiveData(cd => {
                    let accumulatedLiveData = 0
                    let newDataPoint = {}
                    for (let key in newestData) {
                        newDataPoint[key] = newestData[key]?.data.tps ?? 0 + accumulatedLiveData
                        accumulatedLiveData += newestData[key] ?? 0
                    }
                    return [...cd, newDataPoint]
                })

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
        const xScale = scaleLinear().domain([0, liveData.length - 1]).range([0, width])

        const yScale = scaleLinear().domain([-Math.max(...totals), Math.max(...totals)]).range([height, 0])

        // could do some filtering here


        const stackData = cumulatedLiveData

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
    }, [data, width, height, text, liveData, columns, totals, cumulatedLiveData])
    return <>
        {binaryConditionalRender(<svg width={width} height={height}>
            <Tooltip opacity={opacity} text={text} />
            <>{stacks}</>
        </svg>,
            <>
                <Container
                    marginTop={height / 2}
                    centerContent>
                    <BeatLoader size={8} color={'black'} />
                    <Text>Connecting...</Text>
                </Container>
            </>, connected)}
    </>
}
