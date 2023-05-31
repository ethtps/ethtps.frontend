import { DataPointDictionary, IMaxDataModel } from '..'
import { DataPoint, DataType, ProviderResponseModel } from '../../../api-client'

export const groupBy = <T>(array: T[] | undefined, predicate: (value: T, index: number, array: T[]) => string) =>
    array?.reduce((acc, value, index, array) => {
        (acc[predicate(value, index, array)] ||= []).push(value)
        return acc
    }, {} as { [key: string]: T[] })

export const generatePath = (provider?: ProviderResponseModel) => { return { params: { currentProvider: provider?.name ?? "" } } }

export function getMaxDataFor(model?: IMaxDataModel, provider?: string | null, type?: DataType): DataPoint | undefined {
    if (!provider || !type || !model) return
    switch (type) {
        case DataType.Tps:
            if (model.maxTPSData)
                return model.maxTPSData[provider]
        case DataType.Gps:
            if (model.maxGPSData)
                return model.maxGPSData[provider]
        case DataType.GasAdjustedTps:
            if (model.maxGTPSData)
                return model.maxGTPSData[provider]
    }
}