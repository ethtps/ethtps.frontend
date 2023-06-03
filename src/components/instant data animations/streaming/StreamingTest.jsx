
import { Line } from 'react-chartjs-2'
import 'chartjs-adapter-luxon'
import { useState, useEffect, useRef, useMemo } from 'react'

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
        datasetIdKey='id'
        height={height}
        width={width}
        data={{
            labels: columns,
            datasets: columns.map((c, i) => {
                return {
                    label: c,
                    id: i,
                    backgroundColor: providerData.find(p => p.name === c)?.color ?? 'black',
                    borderColor: providerData.find(p => p.name === c)?.color ?? 'black',
                    fill: true,
                    borderDash: [0, 0],
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
                        duration: 1 * 60000,
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
                },
                y: {
                    stacked: true,
                    title: {
                        display: false,
                        text: 'TPS'
                    },
                    ticks: {
                        beginAtZero: true,
                        max: 20,
                        min: 0,
                        stepSize: 5
                    }
                },
            },
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'nearest'
            },
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: false,
                },
                tooltip: {
                    enabled: false,
                    intersect: false,
                    mode: 'nearest',
                    callbacks: {
                        label: function (context) {
                            const label = context.dataset.label || ''
                            if (label) {
                                return label + ': ' + context.parsed.y
                            }
                            return null
                        }
                    }
                }
            },
        }}
    />, [width, height, lastValues, liveData, columns, providerData])

    return <>
        {chart}
    </>
}