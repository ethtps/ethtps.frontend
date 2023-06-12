//Needed for chartjs to work
import { DataType, NumericXYDataPoint, TimeInterval } from "@/api-client"
import { CategoryScale, Chart, Legend, LineElement, LinearScale, PointElement, Title, Tooltip, registerables } from 'chart.js'
// eslint-disable-next-line import/no-internal-modules
import { DataModeButtonGroup, TimeIntervalButtonGroup } from "@/components/buttons"
import { AllData, ExtendedTimeInterval, dataTypeToHumanReadableString, toMoment } from "@/data"
import { api, conditionalRender, useColors } from "@/services"
import { Box, Progress } from "@chakra-ui/react"
import { useSize } from "@chakra-ui/react-use-size"
import { useEffect, useMemo, useRef, useState } from "react"
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ...registerables
)
// eslint-disable-next-line import/no-internal-modules
import 'chart.js/auto'
import moment from 'moment'
import { Chart as Chart2 } from 'react-chartjs-2'

interface ILineChartProps {
  width: number
  height: number
  provider?: string
}

interface Series {
  name: string
  data?: (NumericXYDataPoint | undefined)[]
}

const pad = 40

export function LineChart(props: ILineChartProps) {
  const [loading, setLoading] = useState<boolean>(true)
  const colors = useColors()
  const [interval, setInterval] = useState<ExtendedTimeInterval>(TimeInterval.OneMinute)
  const [dataType, setDataType] = useState<DataType>(DataType.Tps)
  const [allData, setAllData] = useState<Partial<AllData>>({})
  const [chartData, setChartData] = useState<Series[]>()
  useEffect(() => {
    if (!allData || !allData?.tps) {
      return
    }

    const keyz = Object.keys(allData?.tps)
    if (keyz?.length > 0) {
      const series: Series[] = []
      let data: NumericXYDataPoint[] | undefined
      for (const key of keyz) {
        switch (dataType) {
          case DataType.Tps:
            data = allData.tps?.[key]
            break
          case DataType.Gps:
            data = allData.gps?.[key]
            break
          case DataType.GasAdjustedTps:
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
    async function fetchData(dataType: DataType) {
      try {
        const data = await api.getNumberedL2Data({
          dataType: dataType,
          l2DataRequestModel: {
            returnXAxisType: 'Number',
            includeEmptyDatasets: false,
            endDate: moment().utc(true).toDate(),
            startDate: moment().utc(true).subtract(m.amount, m.unit).toDate(),
            provider: props.provider ?? 'All',
          }
        })
        const processed = {} as Record<string, NumericXYDataPoint[]>
        processed[props.provider ?? 'auto'] = data?.data?.dataPoints?.map((x, i) => {
          return {
            x: x.x ? x.x : i,
            y: x.y,
          }
        }) ?? []
        console.log(processed)
        setAllData(old => {

          switch (dataType) {
            case DataType.Tps:
              old.tps = processed as Record<string, NumericXYDataPoint[]>
              break
            case DataType.Gps:
              old.gps = processed as Record<string, NumericXYDataPoint[]>
              break
            case DataType.GasAdjustedTps:
              old.gtps = processed as Record<string, NumericXYDataPoint[]>
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
        scales: {
          x: {
            type: 'timeseries',
            ticks: {
              color: colors.text,
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
        labels: chartData?.map(d => d?.name),
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