//Needed for chartjs to work
import { CategoryScale, Chart, Legend, LineElement, LinearScale, PointElement, Title, Tooltip, registerables } from 'chart.js'
import { DataResponseModel, DataType, ProviderResponseModel, TimeInterval } from "@/api-client"
// eslint-disable-next-line import/no-internal-modules
import { TimeIntervalButtonGroup } from "@/components/buttons"
import { AllData, ExtendedTimeInterval } from "@/data"
import { useColors } from "@/services"
import { Box, Container } from "@chakra-ui/react"
import { useEffect, useState } from "react"
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
import { Chart as Chart2 } from 'react-chartjs-2'

interface ILineChartProps {
  width: number
  height: number
}

interface Series {
  name: string
  data?: (number | undefined)[]
}

export function LineChart(props: ILineChartProps) {
  const [loading, setLoading] = useState<boolean>(true)
  const colors = useColors()
  const [interval, setInterval] = useState<ExtendedTimeInterval>(TimeInterval.OneMinute)
  const [dataType, setDataType] = useState<DataType>(DataType.Tps)
  const [allData, setAllData] = useState<AllData>()
  const [chartData, setChartData] = useState<Series[]>()
  useEffect(() => {
    if (!allData) {
      return
    }

    const keyz = Object.keys(allData.tps)
    if (keyz?.length > 0) {
      const series: Series[] = []
      let data: DataResponseModel[] | undefined
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
          data: data?.map?.(d => d?.data?.[0]?.value),
        })
      }
      setChartData(series)
      console.log(series)
    }
  }, [allData, dataType])
  useEffect(() => {

  }, [interval])
  return <>
    <Box
      w={'100%'}
      h={500}
      bg={colors.tertiary}
      borderRadius={10}>
      <TimeIntervalButtonGroup onChange={(v: ExtendedTimeInterval) => setInterval(v)} />
      <Chart2
        type={'line'}
        width={'100%'}
        height={500}
        options={{
          scales: {
            x: {
              ticks: {
                color: colors.text,
              },
              grid: {
                color: colors.grid,
              }
            },
            y: {
              grid: {
                color: colors.grid,
              }
            }
          },
          maintainAspectRatio: false,
          responsive: true,
          animation: false,
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
            }
          },
        }}
        data={{
          datasets: Array.from(chartData?.map?.(s => {
            return {
              label: s.name,
              data: s.data,
              borderColor: colors.primary,
              backgroundColor: colors.primary,
              fill: false,
              borderDash: [0, 0],
              pointRadius: 0,
              pointHitRadius: 0,
              tension: 0.1
            }
          }) ?? [])
          /*
          datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            borderColor: colors.primary,
            backgroundColor: colors.primary,
            fill: false,
            borderDash: [0, 0],
            pointRadius: 0,
            pointHitRadius: 0,
            tension: 0.1
          }]*/
        }} />
    </Box>
  </>
}