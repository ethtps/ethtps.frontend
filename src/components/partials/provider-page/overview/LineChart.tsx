//Needed for chartjs to work
import { CategoryScale, Chart, Legend, LineElement, LinearScale, PointElement, Title, Tooltip, registerables } from 'chart.js'
import { TimeInterval } from "@/api-client"
// eslint-disable-next-line import/no-internal-modules
import { TimeIntervalButtonGroup } from "@/components/buttons"
import { ExtendedTimeInterval } from "@/data"
import { useColors } from "@/services"
import { Box, Container } from "@chakra-ui/react"
import { useState } from "react"
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
import { Line } from 'react-chartjs-2'

interface ILineChartProps {
  width: number
  height: number
}

export function LineChart(props: ILineChartProps) {
  const colors = useColors()
  const [interval, setInterval] = useState<ExtendedTimeInterval>(TimeInterval.OneMinute)
  return <>
    <Box
      w={'100%'}
      h={500}
      bg={colors.tertiary}
      borderRadius={10}>
      <TimeIntervalButtonGroup onChange={(v: ExtendedTimeInterval) => setInterval(v)} />
      <Line
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
          tooltip: {
            enabled: false,
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
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
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
          }]
        }} />
    </Box>
  </>
}