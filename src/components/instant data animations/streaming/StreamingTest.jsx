import { Chart, registerables } from 'chart.js'
import { Line } from 'react-chartjs-2'
import 'chartjs-adapter-luxon'
import StreamingPlugin from 'chartjs-plugin-streaming'
import { useState, useEffect, useRef, useMemo } from 'react'

//Needed for chartjs to work
Chart.register(...registerables)
Chart.register(StreamingPlugin)

export function StreamingTest({ data, width, height, newestData, connected, providerData, maxEntries = 150 }) {
    const [opacity, setOpacity] = useState(0)
    const [text, setText] = useState("initialState")
    const [stacks, setStacks] = useState([])
    const [liveData, setLiveData] = useState([])
    const [cumulatedLiveData, setCumulatedLiveData] = useState([])
    const [columns, setColumns] = useState([])
    const [colors, setColors] = useState([])
    const [totals, setTotals] = useState([])
    const [lastValues, setLastValues] = useState({})
    useEffect(() => {
        if (!newestData) return

        setColumns(c => {
            const keys = Object.keys(newestData)
            if (keys?.length === 0) return c

            const newColumns = [...c, ...keys.filter(k => !c.includes(k))]

            setLiveData(l => {
                const dataPoints = l.slice(-maxEntries) // Take the last 'maxEntries' data points
                setLastValues(oldValues => {
                    const newLastValues = { ...oldValues } // Make a copy of the last values

                    // Add new data point for each column
                    newColumns.forEach(c => {
                        const value = newestData[c]?.data.tps ?? newLastValues[c] ?? 0

                        dataPoints.push({
                            x: Date.now(),
                            y: value,
                            z: c
                        })

                        newLastValues[c] = value // Update the last value
                    })

                    return newLastValues
                }) // Store the updated last values

                return dataPoints // This replaces the old liveData with the new dataPoints, including the newly added points
            })

            return newColumns
        })
    }, [newestData, maxEntries])
    const chart = useMemo(() => <Line
        height={height}
        width={width}
        data={{
            datasets: columns.map(c => {
                return {
                    label: c,
                    backgroundColor: providerData.find(p => p.name === c)?.color ?? 'black',
                    fill: true,
                    cubicInterpolationMode: 'monotone',
                    data: liveData.filter(d => d.z === c).map(x => {
                        return {
                            x: x.x,
                            y: x.y
                        }
                    }),
                }
            })
        }}
        options={{
            scales: {
                x: {
                    type: 'realtime',
                    realtime: {
                        delay: 2000,
                        refresh: 1000,
                        duration: 60000,
                        delay: 2000,
                        onRefresh: chart => {
                            const now = Date.now()
                            chart.data.datasets.forEach(dataset => {
                                dataset.data.push({
                                    x: now,
                                    y: lastValues[dataset.label] ?? 0
                                })
                            })
                        }
                    }
                }
            }
        }}
    />, [width, height, lastValues, liveData, columns, providerData])

    return <>
        {chart}
    </>
}