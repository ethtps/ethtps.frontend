//Needed for chartjs to work
import {
	CategoryScale,
	Chart,
	Legend,
	LineElement,
	LinearScale,
	PointElement,
	Title,
	registerables,
} from 'chart.js'
import 'chartjs-adapter-luxon'
import AnnotationPlugin from 'chartjs-plugin-annotation'
import StreamingPlugin from 'chartjs-plugin-streaming'
Chart.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Legend,
	AnnotationPlugin,
	...registerables,
	...StreamingPlugin
)
// eslint-disable-next-line import/no-internal-modules
import 'chart.js/auto'
import 'chartjs-adapter-luxon'
import { ETHTPSDataCoreDataType } from 'ethtps.api'
import * as pattern from 'patternomaly'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Chart as Chart2 } from 'react-chartjs-2'
import { BeatLoader } from 'react-spinners'
import { conditionalRender, useColors } from '../../..'
import { dataTypeToHumanReadableString } from '../../../../ethtps.data/src'
import { getPattern } from '../Patterns'

const dataExtractor = (data, dataType) => {
	return {
		tps: data?.tps,
		gps: data?.gps,
		gtps: data?.gps / 21000,
	}
}

const dataSelector = (data, dataType) => {
	if (dataType === ETHTPSDataCoreDataType.TPS) return data?.tps
	if (dataType === ETHTPSDataCoreDataType.GPS) return data?.gps
	return data?.gtps
}

export function StreamingTest({
	width,
	height,
	dataType,
	newestData,
	connected,
	providerData,
	maxEntries,
	duration,
	refreshInterval,
	showSidechains,
	paused,
	isLeaving,
}) {
	const colors = useColors()
	const [liveData, setLiveData] = useState([])
	const [columns, setColumns] = useState([])
	const [lastValues, setLastValues] = useState({})
	useEffect(() => {
		if (!newestData) return

		setColumns((c) => {
			const keys = Object.keys(newestData)
			if (keys?.length === 0) return c
			const newColumns = [...c, ...keys.filter((k) => !c.includes(k))]

			setLiveData((l) => {
				let dataPoints = l // Take the last 'maxEntries' data points
				setLastValues((oldValues) => {
					const newLastValues = { ...oldValues } // Make a copy of the last values

					// Add new data point for each column
					newColumns.forEach((c) => {
						const value = dataExtractor(
							newestData[c]?.data ?? newLastValues[c],
							dataType
						) ?? {
							tps: 0,
							gps: 0,
							gtps: 0,
						}

						dataPoints.push({
							x: Date.now() + refreshInterval,
							y: value,
							z: c,
						})

						newLastValues[c] = value // Update the last value
					})

					return newLastValues
				}) // Store the updated last values
				// We don't really need to remove old data points, since we're using a 'realtime' x-axis
				/*
				if (dataPoints.length > 2 * maxEntries * newColumns.length)
					dataPoints = dataPoints.slice(-maxEntries * newColumns.length)*/
				return dataPoints // This replaces the old liveData with the new dataPoints, including the newly added points
			})
			return newColumns
		})
	}, [newestData, maxEntries, dataType, providerData, refreshInterval])
	const ref = useRef(null)
	const chart = useMemo(() => {
		return (
			<Chart2
				type="line"
				ref={ref}
				id="chart"
				height={height}
				width={width}
				data={{
					labels: columns,
					datasets: columns.map((c, i) => {
						return {
							label: c,
							id: i,
							hidden:
								!showSidechains &&
								providerData?.filter(
									(y) =>
										y.type === 'Sidechain' && y.name === c
								)?.length > 0,
							backgroundColor: pattern.draw(
								getPattern(i * 4),
								providerData.find((p) => p.name === c)?.color ??
								'black'
							),
							borderColor:
								providerData.find((p) => p.name === c)?.color ??
								'black',
							fill: true,
							borderDash: [0, 0],
							pointRadius: 0,
							//pointHitRadius: 0,
							cubicInterpolationMode: 'monotone',
							data: liveData
								.filter((d) => d.z === c)
								.map((x) => {
									return {
										x: x.x,
										y:
											dataSelector(
												x.y ?? lastValues[c],
												dataType
											) ?? 0,
									}
								}),
						}
					}),
				}}
				options={{
					scales: {
						x: !isLeaving
							? {
								type: 'realtime',
								realtime: {
									delay: refreshInterval * 3,
									refresh: refreshInterval,
									duration: duration,
									pause: !connected || paused,
									onRefresh: (chart) => {
										const now =
											Date.now() + refreshInterval
										chart.data.datasets.forEach(
											(dataset) => {
												const e = {
													x: now,
													y:
														dataSelector(
															lastValues[
															dataset
																.label
															] ??
															lastValues[
															dataset
																.label
															],
															dataType
														) ?? 0,
												}
												dataset.data.push(e)
											}
										)
									},
								},
								ticks: {
									color: colors.text,
								},
								grid: {
									color: colors.grid,
								},
							}
							: {},
						y: {
							stacked: true,
							title: {
								display: false,
								text: dataTypeToHumanReadableString(dataType),
							},
							ticks: {
								color: colors.text,
								callback:
									!paused && connected
										? function (label, index, labels) {
											if (label >= 1000000)
												return (
													Math.round(
														label / 1000000
													) + 'M'
												)
											if (label >= 1000)
												return (
													Math.round(label) /
													1000 +
													'k'
												)
											return Math.round(label)
										}
										: undefined,
							},
							grid: {
								color: colors.grid,
							},
						},
					},
					animation: false,
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						decimation: {
							enabled: true,
							algorithm: 'lttb',
						},
						legend: {
							display: false,
							position: 'bottom',
						},
						title: {
							display: false,
						},
					},
					tooltip: {
						enabled: false,
						mode: 'nearest',
						callbacks: {
							label: function (context) {
								const label = context.dataset.label || ''
								if (label) {
									return label + ': ' + context.parsed.y
								}
								return null
							},
						},
					},
				}}
			/>
		)
	}, [
		width,
		height,
		lastValues,
		liveData,
		columns,
		providerData,
		dataType,
		duration,
		refreshInterval,
		showSidechains,
		colors,
		connected,
		paused,
		isLeaving,
	])
	useEffect(() => {
		if (isLeaving) {
			ref.current?.notifyPlugins('reset')
			ref.current?.destroy()
		}
	}, [isLeaving])
	return (
		<>
			{conditionalRender(
				<BeatLoader
					size={8}
					color={colors.text}
					style={{
						position: 'absolute',
						marginTop: (height ?? 250) / 2 - 18,
						marginLeft: (width ?? 0) / 2 - 8,
					}}
				/>,
				!connected || liveData.length < 2
			)}
			{conditionalRender(chart, !isLeaving)}
		</>
	)
}
