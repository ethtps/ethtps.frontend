import { ProviderResponseModel } from '../../../api-client'

export const groupBy = <T>(array: T[] | undefined, predicate: (value: T, index: number, array: T[]) => string) =>
    array?.reduce((acc, value, index, array) => {
        (acc[predicate(value, index, array)] ||= []).push(value)
        return acc
    }, {} as { [key: string]: T[] })

export const generatePath = (provider?: ProviderResponseModel) => { return { params: { currentProvider: provider?.name ?? "" } } }