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
            if (
                model.maxTPSData &&
                Object.keys(model.maxTPSData as DataPointDictionary).some(
                    (x) => x === provider
                )
            ) {
                return model.maxTPSData[Object.keys(model.maxGPSData as DataPointDictionary).find(k => (k ?? "") === (provider ?? "1")) ?? ""]
            }
            else break
        case DataType.Gps:
            if (
                model.maxGPSData &&
                Object.keys(model.maxGPSData as DataPointDictionary).some(
                    (x) => x === provider
                )
            ) {
                return model.maxGPSData[provider]
            }
            else break
        case DataType.GasAdjustedTps:
            if (
                model.maxGTPSData &&
                Object.keys(model.maxGTPSData as DataPointDictionary).some(
                    (x) => x === provider
                )
            ) {
                return model.maxGTPSData[provider]
            }
            else break
        default:
            break
    }
}