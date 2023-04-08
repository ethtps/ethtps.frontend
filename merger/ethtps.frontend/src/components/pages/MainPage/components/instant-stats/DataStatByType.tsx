import * as React from "react";
import { TreemapInstantDataStat } from './treemaps/TreemapInstantDataStat';
import { BrowserView, MobileView } from 'react-device-detect';
import StatTypeSelector from './StatTypeSelector';
import InstantDataStat from './bar/InstantDataStat'
import TypeDataStat from './bar/TypeDataStat';
import TreemapTypeDataStat from "./treemaps/TreemapTypeDataStat";
import TotalDataSummaryStat from "./bar/TotalDataSummaryStat";
import { DataResponseModelDictionary, StringDictionary } from "../../../../../models";
import { DataType, ProviderResponseModel, TimeInterval } from "../../../../../services/api-client/src/models";

interface DataStatByTypeProps {
    split: string;
    excludeSidechains: boolean;
    colorDictionary: StringDictionary
    data: DataResponseModelDictionary
    providerData: ProviderResponseModel[]
    mode: DataType
    providerTypeColorDictionary: StringDictionary
    allData: DataResponseModelDictionary
    smoothing: TimeInterval
}

export function DataStatByType(props: DataStatByTypeProps) {
    let title: string
    let stat: JSX.Element
    switch (props.split) {
        case 'network':
            title = 'Each section of the chart below represents the throughput of a network. Data gets updated automatically.';
            stat = <>
                <MobileView>
                    <InstantDataStat
                        data={this.state.data}
                        colorDictionary={this.state.colorDictionary}
                        mode={this.state.mode}
                        providerData={this.state.providerData} />
                </MobileView>
                <BrowserView>
                    <TreemapInstantDataStat
                        data={this.state.data}
                        colorDictionary={this.state.colorDictionary}
                        mode={this.state.mode}
                        providerData={this.state.providerData} />
                </BrowserView>
            </>
            break;
        case 'networkType':
            title = 'Each section of the chart below represents the total throughput of all networks of a certain type. Data gets updated automatically.';
            stat = <>
                <MobileView>
                    <TypeDataStat
                        data={this.state.data}
                        colorDictionary={this.state.providerTypeColorDictionary}
                        mode={this.state.mode}
                        providerData={this.state.providerData} />
                </MobileView>
                <BrowserView>
                    <TreemapTypeDataStat
                        data={this.state.data}
                        colorDictionary={this.state.providerTypeColorDictionary}
                        mode={this.state.mode}
                        providerData={this.state.providerData} />
                </BrowserView>
            </>
            break;
    }
    return <>
        <TotalDataSummaryStat
            smoothing={this.state.smoothing}
            providerData={this.state.providerData}
            mode={this.state.mode}
            data={this.state.data} />
        <p>
            Click one of the buttons below to change the chart type
        </p>
        <StatTypeSelector onChange={this.onStatChanged.bind(this)} split={this.state.split} />
        <p>
            {title}
        </p>
        {stat}
    </>

}