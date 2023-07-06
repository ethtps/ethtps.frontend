import { Container, Text } from "@chakra-ui/react"
import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import { BeatLoader } from "react-spinners"
import { binaryConditionalRender } from '../../../'
import { Streamgraph } from "./"

const Tooltip = ({ opacity, text, x, y }) => {
    return (
        <text x={x} y={y} style={{ opacity: opacity, fontSize: 17, fill: "black" }}>
            {text}
        </text>
    )
}

export const D3Stream = ({ data, width, height, newestData, connected, maxEntries = 10 }) => {
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
                let lastValues = {}

                setTotals(m => [...m,
                Object.keys(dataPoint).map(x => {
                    // If the current value is not defined, use the last value if it exists, otherwise use 0.
                    let value = dataPoint[x] !== undefined ? dataPoint[x] : (lastValues[x] !== undefined ? lastValues[x] : 0)
                    // Update the last value for this key.
                    lastValues[x] = value
                    return value
                }).reduce((a, b) => a + b, 0)]
                    .slice(-maxEntries))


                setCumulatedLiveData(cd => {
                    let accumulatedLiveData = 0
                    let newDataPoint = {}
                    for (let key in newestData) {
                        newDataPoint[key] = newestData[key]?.data.tps ?? 0 + accumulatedLiveData
                        accumulatedLiveData += newestData[key] ?? 0
                    }
                    return [...cd, newDataPoint].slice(-maxEntries)
                })

                return [...l, dataPoint].slice(-maxEntries)
            })
            return newColumns
        })

    }, [newestData, maxEntries])
    let lastValues = {}

    const processed = liveData.flatMap((d, i) =>
        Object.keys(d).map(x => {
            // If the current value is not defined, use the last value if it exists, otherwise use 0.
            let value = d[x] !== undefined ? d[x] : (lastValues[x] !== undefined ? lastValues[x] : 0)
            // Update the last value for this key.
            lastValues[x] = value
            return {
                x: i,
                y: value,
                z: x
            }
        })
    )
    const stream = Streamgraph(processed,
        {
            width: width,
            height: height,
            x: d => d.x,
            y: d => d.y,
            z: d => d.z,
            yLabel: "TPS",
            yDomain: [-Math.max(...totals), Math.max(...totals)],
        })

    const ref = useRef(null)
    useEffect(() => {
        if (!ref.current) return

        if (!ref.current.children[0]) ref.current.appendChild(stream)
        else ref.current.replaceChild(stream, ref.current.children[0])
    }, [ref, stream])
    return <>
        {binaryConditionalRender(<>
            <motion.div initial={{ translateX: 0 }}
                animate={{ translateX: -width }}
                transition={{
                    type: "just",
                    duration: 60 * 5 * 1000,
                }}>
                <div ref={ref} width={width} height={height}>
                </div>
            </motion.div>
        </>,
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
