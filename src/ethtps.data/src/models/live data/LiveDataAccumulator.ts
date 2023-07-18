import { L2DataUpdateModel } from '.'
import { GenericDictionary, logToOverlay } from '../../'
import { ILiveDataCollectionOperator, InsertionType } from './DataOperators'
import { LiveDataAggregator } from './LiveDataAggregator'
import { LiveDataPoint } from './LiveDataPoint'

/**
 * Uses a live data aggregator to accumulate data over time and provides methods for quickly building series.
 */
export class LiveDataAccumulator implements ILiveDataCollectionOperator {
    private _all: GenericDictionary<LiveDataPoint>[] = []
    private _aggregator: LiveDataAggregator = new LiveDataAggregator()
    public get distinctProviders() {
        const result = new Array<string>()
        for (let entry in this._all) {
            for (let k in Object.keys(entry)) {
                if (!result.includes(k)) result.push(k)
            }
        }
        return result
    }

    public get all() {
        return this._all
    }

    constructor(initialData?: GenericDictionary<L2DataUpdateModel>) {
        if (!!initialData) this._aggregator = new LiveDataAggregator(initialData)
    }
    public get lastEntry(): GenericDictionary<L2DataUpdateModel> {
        return this._aggregator.lastEntry
    }

    public get timeRange(): [number, number] {
        if (this._all.length === 0) return [Date.now(), Date.now()]
        const first = this._all[0]
        const last = this._all[this._all.length - 1]
        const firstKey = Object.keys(first)[0]
        const lastKey = Object.keys(last)[0]
        const firstEntry = first[firstKey]
        const lastEntry = last[lastKey]
        return [firstEntry.x ?? Date.now(), lastEntry.x ?? Date.now()]
    }

    public get lastEntryAsDataPoints(): LiveDataPoint[] {
        const result = new Array<LiveDataPoint>()
        const k = [...Object.keys(this._aggregator.lastEntry)]
        for (let i = 0; i < k.length; i++) {
            const x = this._aggregator.lastEntry[k[i]]
            result.push(x.data as LiveDataPoint)
        }
        return result
    }

    public get maxTotal(): LiveDataPoint {
        return this._aggregator.maxTotal
    }

    public get maxSingle(): LiveDataPoint {
        return this._aggregator.maxSingle
    }

    public get sum(): LiveDataPoint {
        return this._aggregator.sum
    }

    public get average(): LiveDataPoint {
        return this._aggregator.average
    }

    /**
     * Inserts a new entry into the accumulator and updates the aggregator (implicitly, it also updates the last entry).
     * @param entry
     * @param mode
     */
    public insert(entry: GenericDictionary<L2DataUpdateModel>, mode: InsertionType = InsertionType.Append) {
        this._aggregator.updateMultiple(entry)
        let dict: GenericDictionary<LiveDataPoint> = {}
        for (let k of Object.keys(entry)) {
            const x = entry[k]
            if (!x) continue
            const p = new LiveDataPoint()
            p.x = Date.now()
            p.z = k
            p.tps = x.data?.tps
            p.gps = x.data?.gps
            dict = Object.assign(dict, {
                [k]: p
            })
        }
        if (mode === InsertionType.Prepend) {
            this._all.unshift(dict)
        } else if (mode === InsertionType.Append) {
            this._all.push(dict)
        } else {
            this._all.push(dict)
        }
    }

    public getDataPointsFor(provider?: string | null): LiveDataPoint[] | undefined {
        if (!provider) return undefined
        const result = new Array<LiveDataPoint>()
        this._all.filter(x => !!x[provider]).forEach(x => result.push(x[provider] as LiveDataPoint))
        return result
    }
}