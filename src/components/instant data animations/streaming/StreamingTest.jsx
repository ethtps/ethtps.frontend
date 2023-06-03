
import { Line } from 'react-chartjs-2'
import 'chartjs-adapter-luxon'
import { useState, useEffect, useRef, useMemo } from 'react'
import { DataType } from '@/api-client'
import { dataTypeToHumanReadableString } from '@/data'
import * as pattern from 'patternomaly'
import { getPattern } from '../Patterns'

const dataExtractor = (data, dataType) => {
    return {
        tps: data?.tps,
        gps: data?.gps,
        gtps: data?.gps / 21000
    }
}

const dataSelector = (data, dataType) => {
    if (dataType === DataType.Tps)
        return data?.tps
    if (dataType === DataType.Gps)
        return data?.gps
    return data?.gtps
}

export function StreamingTest(
    {
        width,
        height,
        dataType,
        newestData,
        connected,
        providerData,
        maxEntries = 150
    }) {
    const [liveData, setLiveData] = useState([])
    const [columns, setColumns] = useState([])
    const [lastValues, setLastValues] = useState({})
    useEffect(() => {
        if (!newestData) return

        setColumns(c => {
            const keys = Object.keys(newestData)
            if (keys?.length === 0) return c

            const newColumns = [...c, ...keys.filter(k => !c.includes(k))]

            setLiveData(l => {
                const dataPoints = l // Take the last 'maxEntries' data points
                setLastValues(oldValues => {
                    const newLastValues = { ...oldValues } // Make a copy of the last values

                    // Add new data point for each column
                    newColumns.forEach(c => {
                        const value = dataExtractor(newestData[c]?.data ?? newLastValues[c], dataType) ?? {
                            tps: 0,
                            gps: 0,
                            gtps: 0
                        }

                        dataPoints.push({
                            x: Date.now(),
                            y: value,
                            z: c
                        })

                        newLastValues[c] = value // Update the last value
                    })

                    return newLastValues
                }) // Store the updated last values

                return dataPoints.slice(-maxEntries) // This replaces the old liveData with the new dataPoints, including the newly added points
            })

            return newColumns
        })
    }, [newestData, maxEntries, dataType])
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
                    backgroundColor: pattern.draw(getPattern(i * 4), providerData.find(p => p.name === c)?.color ?? 'black'),
                    borderColor: providerData.find(p => p.name === c)?.color ?? 'black',
                    fill: true,
                    borderDash: [0, 0],
                    cubicInterpolationMode: 'monotone',
                    data: liveData.filter(d => d.z === c).map(x => {
                        return {
                            x: x.x,
                            y: dataSelector(x.y ?? lastValues[c], dataType) ?? 0
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
                        refresh: 2000,
                        duration: 1 * 60000,
                        onRefresh: chart => {
                            const now = Date.now()
                            chart.data.datasets.forEach(dataset => {
                                const e = {
                                    x: now,
                                    y: dataSelector(lastValues[dataset.label] ?? lastValues[dataset.label], dataType) ?? 0
                                }
                                dataset.data.push(e)
                            })
                        }
                    }
                },
                y: {
                    stacked: true,
                    title: {
                        display: false,
                        text: dataTypeToHumanReadableString(dataType)
                    },
                    ticks: {
                        callback: function (label, index, labels) {
                            if (label >= 1000000)
                                return label / 1000000 + 'M'
                            if (label >= 1000)
                                return label / 1000 + 'k'
                            return label
                        }
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
                    display: false,
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
    />, [width, height, lastValues, liveData, columns, providerData, dataType])

    return <>
        {chart}
    </>
}