import { GenericDictionary } from '../..'
import { L2DataUpdateModel } from './L2DataUpdateModel'
import { LiveDataPoint } from './LiveDataPoint'

export interface ILiveDataPointOperator {
    readonly lastEntry: GenericDictionary<L2DataUpdateModel>
    readonly maxTotal: LiveDataPoint
    readonly maxSingle: LiveDataPoint
    readonly sum: LiveDataPoint
    readonly average: LiveDataPoint
}

export interface ILiveDataCollectionOperator extends ILiveDataPointOperator {
    readonly all: GenericDictionary<LiveDataPoint>[]
    readonly lastEntryAsDataPoints: LiveDataPoint[]
    readonly distinctProviders: string[]
    insert(entry: GenericDictionary<L2DataUpdateModel>, mode: InsertionType): void
    getDataPointsFor(provider?: string | null): LiveDataPoint[] | undefined
}

export enum InsertionType {
    Append, Prepend, AutoIndex
}