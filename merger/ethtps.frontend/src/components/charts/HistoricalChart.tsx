import 'fix-date';
import { globalGeneralApi } from '../../services/common'
import { IntervalSelector } from "./IntervalSelector";
import { InfoTypeSelector } from "./InfoTypeSelector";
import { ScaleSelector } from './ScaleSelector';
import { Line } from "react-chartjs-2";
import LinearProgress from '@mui/material/LinearProgress';
import { DataType, TimeInterval } from '../../services/api-client/src/models';
import { ChartScale } from '.';
import { DefaultRequestParameters, StringDictionary } from '../../models';
import { useExcludeSidechains, useNetwork, useProviderColors } from '../../hooks';
import { useCallback, useState } from 'react';
import { numberFormat } from '../../services/Helpers';

interface IHistoricalChartProps {
  interval: TimeInterval,
  mode: DataType,
  scale: ChartScale,
  data?: any[],
  labels?: string[],
  network: string,
  provider: string,
  color?: string,
  backgroundColor?: string,
  colorDictionary: StringDictionary,
  datasets?: [
    {
      label: string,
      data: Number[],
      fill: boolean,
      pointHitRadius: number
    }
  ],
  allIntervals?: string[],
  years?: Number[],
  selectedYear?: Number,
  loading?: boolean,
  height: number,
}



export function HistoricalChart(props: IHistoricalChartProps) {
  return <></>
  const colors = useProviderColors()
  const [interval, setInterval] = useState(props.interval);
  const [intervals, setIntervals] = useState(props.allIntervals);
  const [mode, setMode] = useState(props.mode);
  const [scale, setScale] = useState(props.scale);
  const selectedNetwork = useNetwork()
  const [years, setYears] = useState(props.years);
  const [year, setYear] = useState(props.selectedYear);
  const sidechains = useExcludeSidechains()
  const getData = useCallback(() => {

    globalGeneralApi.aPIV2GetIntervalsWithDataGet({ provider: this.props.provider, network: selectedNetwork.network, includeSidechains: !sidechains.excludeSidechains }, (err, data, res) => {
      if (data != null) {
        setIntervals(data.map(this.reverseTransformIntervalName))
      }
    })

    globalGeneralApi.aPIV2GetUniqueDataYearsGet({ provider: this.props.provider, network: this.props.network, includeSidechains: !sidechains.excludeSidechains, ...DefaultRequestParameters }, (err, data, res) => {
      if (data?.length > 1) {
        setYears(data);
      }
    })

  }, [selectedNetwork.network, sidechains.excludeSidechains]);

  const updateChart = (state) => {
    this.updateChartFromModel(props.provider, props.interval, props.selectedYear, props.network, props.mode,);
  }

  const buildDatasets = (data: any) => {
    if (data === null)
      return;

    let maxLength = Math.max(...Object.keys(data).map(key => data[key].length));
    let labels = [];
    let datasets = [];
    for (let key of Object.keys(data)) {
      let d = data[key];
      if (d.length < maxLength) {
        let dLength = maxLength - d.length;
        for (let i = 0; i < dLength; i++) {
          d = [{
            data: [{
              date: new Date(),
              value: 0
            }
            ]
          }, ...d]
        }
      }
      let l = d.map(x => this.extractLabel(x.data[0].date));
      if (l.length > labels.length) {
        labels = l;
      }
      datasets.push({
        label: key,
        data: d.map(x => x.data[0].value),
        borderColor: this.props.colorDictionary[key],
        backgroundColor: this.props.colorDictionary[key] + "11",
        fill: Object.keys(data).length <= 1,
        showLine: true,
        pointHitRadius: 20
      });
    }
    this.setState({ datasets: datasets });
    this.setState({ labels: labels });
    this.setState({ loading: false });
  }


  let linearProgress = <></>;
  if (this.props.loading) {
    linearProgress = <LinearProgress />;
  }
  return (
    <div>
      <div>
        <IntervalSelector
          allIntervals={this.props.allIntervals}
          interval={interval}
          onChange={(i) => setInterval(i)}
          onYearChange={(y) => setYear(y)}
          years={years.map(x => x.toString())} />
      </div>
      <div>
        <div>
          <Line height={this.props.height} data={{
            labels: this.props.labels,
            datasets: this.props.datasets
          }}
            options={{
              plugins: {
                legend: {
                  display: false
                }
              },
              elements: {
                line: {
                  tension: 0.3
                },
                point: {
                  radius: 0
                }
              },
              scales: {
                x: {
                  ticks: {
                    display: true
                  },
                  grid: {
                    display: true
                  }
                },
                y: {
                  stacked: true,
                  type: this.transformScaleName(scale),
                  ticks: {
                    callback: function (value: any) {
                      return numberFormat.format(value);
                    }
                  }
                }
              }
            }} />
          {linearProgress}
        </div>
      </div>
      <InfoTypeSelector mode={this.props.mode} onChange={this.onInfoTypeChanged.bind(this)} />
      <div style={{ float: "right" }}>
        <ScaleSelector scale={this.props.scale} onChange={this.onScaleChanged.bind(this)} />
      </div>
    </div>
  );

}