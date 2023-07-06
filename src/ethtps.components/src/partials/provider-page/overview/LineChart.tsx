//Needed for chartjs to work
import { Box, Heading, Progress } from "@chakra-ui/react"
import { useSize } from "@chakra-ui/react-use-size"
import { CategoryScale, Chart, Decimation, Legend, LineElement, LinearScale, PointElement, Title, Tooltip, registerables } from 'chart.js'
import { useEffect, useMemo, useRef, useState } from "react"
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Decimation,
  ...registerables
)
// eslint-disable-next-line import/no-internal-modules
import 'chart.js/auto'
import { ETHTPSDataCoreDataType, ETHTPSDataCoreModelsDataPointsXYPointsNumericXYDataPoint, ETHTPSDataCoreModelsDataPointsXYPointsXPointType, ETHTPSDataCoreTimeInterval } from 'ethtps.api'
import moment from 'moment-timezone'
import { Chart as Chart2 } from 'react-chartjs-2'
import { DataModeButtonGroup, TimeIntervalButtonGroup, conditionalRender, useColors } from '../../../..'
import { AllData, ETHTPSApi, ExtendedTimeInterval, dataTypeToHumanReadableString, toMoment } from "../../../../../ethtps.data/src"

moment.tz.setDefault("Europe/Berlin")

interface ILineChartProps {
  width: number
  height: number
  provider?: string
  title?: string
  api: ETHTPSApi
}

interface Series {
  name: string
  data?: (ETHTPSDataCoreModelsDataPointsXYPointsNumericXYDataPoint | undefined)[]
}

const pad = 40

export function LineChart(props: ILineChartProps) {
  const api = props.api
  const [loading, setLoading] = useState<boolean>(true)
  const colors = useColors()
  const [interval, setInterval] = useState<ExtendedTimeInterval>(ETHTPSDataCoreTimeInterval.ONE_MINUTE)
  const [dataType, setDataType] = useState<ETHTPSDataCoreDataType>(ETHTPSDataCoreDataType.TPS)
  const [allData, setAllData] = useState<Partial<AllData>>({})
  const [chartData, setChartData] = useState<Series[]>()
  useEffect(() => {
    if (!allData || !allData?.tps) {
      return
    }

    const keyz = Object.keys(allData?.tps)
    if (keyz?.length > 0) {
      const series: Series[] = []
      let data: ETHTPSDataCoreModelsDataPointsXYPointsNumericXYDataPoint[] | undefined
      for (const key of keyz) {
        switch (dataType) {
          case ETHTPSDataCoreDataType.TPS:
            data = allData.tps?.[key]
            break
          case ETHTPSDataCoreDataType.GPS:
            data = allData.gps?.[key]
            break
          case ETHTPSDataCoreDataType.GAS_ADJUSTED_TPS:
            data = allData.gtps?.[key]
            break
          default:
            break
        }
        series.push({
          name: key,
          data: data,
        })
      }
      setChartData(series)
    }
  }, [allData, dataType])
  useEffect(() => {
    const m = toMoment(interval)
    async function fetchData(dataType: ETHTPSDataCoreDataType) {
      try {
        const data = await api.getL2Data({
          dataType: dataType,
          eTHTPSDataCoreModelsQueriesDataRequestsL2DataRequestModel: {
            returnXAxisType: ETHTPSDataCoreModelsDataPointsXYPointsXPointType.NUMBER,
            includeEmptyDatasets: false,
            includeSimpleAnalysis: true,
            includeComplexAnalysis: true,
            endDate: moment().toDate(),
            startDate: moment().subtract(m.amount, m.unit).toDate(),
            provider: props.provider ?? 'All',

          }
        })
        const processed = {} as Record<string, ETHTPSDataCoreModelsDataPointsXYPointsNumericXYDataPoint[]>
        processed[props.provider ?? 'auto'] = data?.data?.dataPoints?.map((x: ETHTPSDataCoreModelsDataPointsXYPointsNumericXYDataPoint, i: number) => {
          return {
            x: x.x ? x.x : i,
            y: x.y,
          }
        }) ?? []
        setAllData(old => {

          switch (dataType) {
            case ETHTPSDataCoreDataType.TPS:
              old.tps = processed as Record<string, ETHTPSDataCoreModelsDataPointsXYPointsNumericXYDataPoint[]>
              break
            case ETHTPSDataCoreDataType.GPS:
              old.gps = processed as Record<string, ETHTPSDataCoreModelsDataPointsXYPointsNumericXYDataPoint[]>
              break
            case ETHTPSDataCoreDataType.GAS_ADJUSTED_TPS:
              old.gtps = processed as Record<string, ETHTPSDataCoreModelsDataPointsXYPointsNumericXYDataPoint[]>
              break
            default:
              break
          }
          return {
            tps: old.tps,
            gps: old.gps,
            gtps: old.gtps,
          }
        })
      }
      catch (e) {
        console.error(e)
      }
    }
    async function fetchAllData() {
      setLoading(true)
      await fetchData(dataType)
      setLoading(false)
    }
    fetchAllData()
  }, [interval, props.provider, dataType])
  const containerRef = useRef<any>(null)
  const sizeRef = useSize(containerRef)
  const chart = useMemo(() => {
    return <Chart2
      type={'line'}
      width={sizeRef?.width}
      height={sizeRef?.height ?? 0 - pad}
      style={{
        padding: '5px',
        paddingTop: pad
      }}
      options={{
        indexAxis: 'x',
        scales: {
          x: {
            type: 'timeseries',
            ticks: {
              source: 'data',
              color: colors.text,
              maxTicksLimit: 10,
            },
            grid: {
              color: colors.grid,
            }
          },
          y: {
            stacked: true,
            title: {
              display: false,
              text: dataTypeToHumanReadableString(dataType)
            },
            ticks: {
              color: colors.text,
              callback: (!loading) ? function (label, index, labels) {
                const v = parseInt(label.toString())
                if (v >= 1000000)
                  return v / 1000000 + 'M'
                if (v >= 1000)
                  return v / 1000 + 'k'
                return label
              } : undefined
            },
            grid: {
              color: colors.grid,
            }
          },
        },
        maintainAspectRatio: false,
        responsive: true,
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
          }
        },
      }}
      data={{
        datasets: (chartData?.map?.(s => {
          return {
            label: s.name,
            data: s.data?.map(d => {
              return {
                x: d?.x,
                y: d?.y
              }
            }),
            fill: false,
            borderColor: colors.text,
            borderDash: [0, 0],
            pointRadius: 0,
            pointHitRadius: 0,
            tension: 0.3
          }
        }) ?? [])
      }} />
  }, [chartData, colors.grid, colors.text, sizeRef?.height, sizeRef?.width, loading, dataType])
  return <>
    <Heading size={'md'}>{props.title}</Heading>
    <Box
      ref={containerRef}
      w={'100%'}
      h={500 + pad}
      bg={colors.tertiary}
      borderRadius={10}
      sx={{
        margin: 0,
        padding: 0,
      }}>

      <Box
        w={sizeRef?.width}
        bg={colors.tertiary}
        borderRadius="lg"
        sx={{
          margin: 0,
          paddingBottom: '10px',
          position: 'absolute',
        }}
        h={pad + 'px'}>
        <DataModeButtonGroup float='left' />
        <TimeIntervalButtonGroup loading={loading} onChange={(v: ExtendedTimeInterval) => setInterval(v)} />
      </Box>
      {chart}
      {conditionalRender(<Progress w={sizeRef?.width} isIndeterminate size='xs' colorScheme='pink' aria-label='loading' />, loading)}
    </Box>
  </>
}