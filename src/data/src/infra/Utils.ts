import { IDataModel } from '..'
import { DataPoint, DataType, ProviderResponseModel } from '../../../api-client'

export const groupBy = <T>(array: T[] | undefined, predicate: (value: T, index: number, array: T[]) => string) =>
    array?.reduce((acc, value, index, array) => {
        (acc[predicate(value, index, array)] ||= []).push(value)
        return acc
    }, {} as { [key: string]: T[] })

export const generatePath = (provider?: ProviderResponseModel) => { return { params: { currentProvider: provider?.name ?? "" } } }

export function getMaxDataFor(model?: IDataModel, provider?: string | null, type?: DataType): DataPoint | undefined {
    if (!provider || !type || !model) return
    switch (type) {
        case DataType.Tps:
            if (model.tpsData)
                return model.tpsData[provider]
        case DataType.Gps:
            if (model.gpsData)
                return model.gpsData[provider]
        case DataType.GasAdjustedTps:
            if (model.gtpsData)
                return model.gtpsData[provider]
    }
}