import {
  DataResponseModelDictionary,
  StringDictionary
} from '../../../../../../models'
import { Bar } from 'react-chartjs-2'
import { ProviderResponseModel } from '../../../../../../services/api-client/src/models'
import { colorDictionary } from '../../../../../../services/defaultData'

interface IInstantDataStatProps {
  data: DataResponseModelDictionary
  providerData: ProviderResponseModel[]
  mode: string
  colorDictionary: StringDictionary
}

const calculateTotalData = (props: IInstantDataStatProps) => {
  const t = props.providerData
    .filter((x) => props.data[x.name] !== undefined && props.data[x.name][0] !== null)
    .map((x) => props.data[x.name][0].data[0].value)
  return t.reduce((a, b) => a + b)
}

const createDataset = (
  x: ProviderResponseModel,
  props: DataResponseModelDictionary
) => {
  return {
    label: x.name,
    data: [props.data[x.name][0].data[0].value],
    backgroundColor: colorDictionary[x.name]
  }
}

const createDatasets = (props: IInstantDataStatProps) =>
  props.providerData
    .filter(
      (x) => props.data[x.name] !== undefined && props.data[x.name][0] !== null
    )
    .map((x) => createDataset(x, props.data))

export function InstantDataStat(props: IInstantDataStatProps) {
  return (
    <>
      <Bar
        data={{
          labels: [''],
          datasets: { ...createDatasets(props) }
        }}
        height={25}
        options={{
          indexAxis: 'y',
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              stacked: true,
              max: calculateTotalData(props),
              ticks: {
                display: false
              },
              grid: {
                display: false
              }
            },
            y: {
              stacked: true,
              ticks: {
                display: false
              },
              grid: {
                display: false
              }
            }
          }
        }}
      />
    </>
  )
}

export default InstantDataStat
