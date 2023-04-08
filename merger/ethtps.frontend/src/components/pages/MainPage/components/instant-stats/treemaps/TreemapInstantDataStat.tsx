import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { addThousandsSeparators, formatModeName, to2DecimalPlaces } from "../../../../../../services/common";
import { DataResponseModelDictionary, StringDictionary } from "../../../../../../models";
import { DataType, ProviderResponseModel } from "../../../../../../services/api-client/src/models";

interface TreemapInstantDataStatProps {
    data: DataResponseModelDictionary,
    providerData: ProviderResponseModel[],
    colorDictionary: StringDictionary,
    mode: DataType
}
const calculateTotalData = (state: TreemapInstantDataStatProps) => {
    if (!state.data)
        return 20;

    let t = state.providerData.filter(x => state.data[x.name] !== undefined).map(x => state.data[x.name][0].data[0].value);
    if (t.length === 0) {
        return 0;
    }
    return t.reduce((a, b) => a + b);
}

const createDataPoint = (x: ProviderResponseModel, state: TreemapInstantDataStatProps) => {
    let value = to2DecimalPlaces(state.data[x.name][0].data?.[0]?.value);
    return {
        x: `${x.name} (${addThousandsSeparators(value)} ${formatModeName(state.mode)})`,
        y: value
    }
}

const createSeries = (state: TreemapInstantDataStatProps) =>
    (state.providerData || state.data || !state.colorDictionary) ?
        [{ data: [] }]
        :
        [{ data: state.providerData.filter(x => state.data[x.name] !== undefined && state.data[x.name][0] !== null).map(x => createDataPoint(x, state)) }];


export function TreemapInstantDataStat(props: TreemapInstantDataStatProps) {
    return <>
        <div id="chart">
            <ReactApexChart
                options={{
                    legend: {
                        show: false
                    },
                    chart: {
                        height: 350,
                        type: 'treemap',
                        toolbar: {
                            show: false
                        }
                    },
                    colors: Object.keys(props.colorDictionary),
                    plotOptions: {
                        treemap: {
                            distributed: true,
                            enableShades: false,
                            useFillColorAsStroke: true,
                        }
                    },
                    states: {
                        normal: {
                            filter: {
                                type: 'none',
                                value: 0,
                            }
                        },
                        hover: {
                            filter: {
                                type: 'darken',
                                value: 0.35,
                            }
                        }
                    },
                    tooltip: {
                        y: {
                            formatter: (value: Number, { series, seriesIndex, dataPointIndex, w }) => ""
                        }
                    }
                }}
                series={createSeries(props)}
                type="treemap"
                height={350} />
        </div>
    </>
}
