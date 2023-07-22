import { L2DataUpdateModel, MinimalDataPoint } from '.'
import { GenericDictionary } from '../../'
import { ILiveDataCollectionOperator, InsertionType } from './DataOperators'
import { LiveDataAggregator } from './LiveDataAggregator'
import { LiveDataPoint } from './LiveDataPoint'

/**
 * Uses a live data aggregator to accumulate data over time and provides methods for quickly building series.
 */
export class LiveDataAccumulator implements ILiveDataCollectionOperator {
    private _all: GenericDictionary<LiveDataPoint>[] = []
    private _aggregator: LiveDataAggregator = new LiveDataAggregator()
    private _maxValuePoints: number = 100 // (?) not sure how many to keep r/n
    private _cacheLoaded: boolean | undefined = undefined
    public get loadedCache(): boolean | undefined {
        if (!this._cacheLoaded) {
            if (!this.allFlat.some(x => !x.key)) {
                this._cacheLoaded = true
            }
        }
        return this._cacheLoaded
    }

    constructor(initialData?: GenericDictionary<L2DataUpdateModel>) {
        if (!!initialData) this._aggregator = new LiveDataAggregator(initialData)
        else if (typeof window !== 'undefined') {
            try { // Retrieve from cache
                const cached = localStorage.getItem('live-data-accumulator')
                if (!!cached) {
                    (JSON.parse(cached) as []).forEach((x: GenericDictionary<LiveDataPoint>) => {
                        const p: GenericDictionary<LiveDataPoint> = {}
                        Object.keys(x).forEach(k => p[k] = {
                            ...x[k]
                        } as LiveDataPoint)
                        this._all.push(p)
                        setTimeout(() => {
                            if (!this.loadedCache) {
                                this._cacheLoaded = true
                            }
                        }, 2000)
                    })
                }
            } catch (e) {
                this._cacheLoaded = true
                console.error('Cache retrieval failed', e)
            }
        }
        this._ny = this.allFlat.length
        setInterval(() => {
            localStorage.setItem('live-data-accumulator', JSON.stringify(this._all))
        }, 30000)
    }

    public get distinctProviders() {
        const result = new Array<string>()
        for (let entry of this._all) {
            for (let k of Object.keys(entry)) {
                if (!result.includes(k)) result.push(k)
            }
        }
        return result
    }

    public get all() {
        return this._all
    }

    public get allFlat() {
        return this.distinctProviders.flatMap(p => this.getDataPointsFor(p)!)
    }

    public get allStacked() {
        const keys = this.distinctProviders
        const result = new Array<GenericDictionary<LiveDataPointWithPrevious>>()
        for (let i = 0; i < this.all.length; i++) {
            let entry = this._all[i]
            let dict: GenericDictionary<LiveDataPointWithPrevious> = {}
            let tpssum = 0
            let gpssum = 0
            for (let j = 0; j < keys.length; j++) {
                const k = keys[j]
                const p = new LiveDataPoint() as LiveDataPointWithPrevious
                p.previous = {
                    tps: tpssum,
                    gps: gpssum
                } as MinimalDataPoint
                tpssum += (entry[k]?.tps ?? 0)
                gpssum += (entry[k]?.gps ?? 0)
                p.x = entry[k]?.x ?? 0
                p.z = k
                p.tps = tpssum
                p.gps = gpssum
                dict = Object.assign(dict, ({ [k]: p }) as GenericDictionary<LiveDataPointWithPrevious>)
            }
            result.push(dict)
        }
        return result
    }

    public get lastEntry(): GenericDictionary<L2DataUpdateModel> {
        return this._aggregator.lastEntry
    }

    public get timeRange(): [number, number] {
        if (this._all.length === 0) return [0, 0]
        const first = this._all[0]
        const last = this._all[this._all.length - 1]
        const firstKey = Object.keys(first)[0]
        const lastKey = Object.keys(last)[0]
        const firstEntry = first[firstKey]
        const lastEntry = last[lastKey]
        return [firstEntry.x! ?? 0, lastEntry.x! ?? 0]
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
    private _ny: number
    public get valuePoints(): number {
        return this._ny
    }

    public get timePoints(): number {
        return this._all.length
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
        const xnow = Date.now()
        entry = this._aggregator.lastEntry
        for (let k of Object.keys(entry)) {
            const x = entry[k]
            if (!x) continue
            const p = new LiveDataPoint()
            p.x = xnow
            p.z = k
            p.tps = x.data?.tps
            p.gps = x.data?.gps
            dict = Object.assign(dict, {
                [k]: p
            })
            this._ny++
        }
        if (mode === InsertionType.Prepend) {
            this._all.unshift(dict)
        } else if (mode === InsertionType.Append) {
            this._all.push(dict)
        } else {
            this._all.push(dict)
        }
        if (this._ny >= this._maxValuePoints) {
            const removed = this._all.shift()
            this._ny -= Object.keys(removed!).length
        }
    }

    public getDataPointsFor(provider?: string | null): LiveDataPoint[] | undefined {
        if (!provider) return undefined
        const result = new Array<LiveDataPoint>()
        this._all.filter(x => !!x[provider]).forEach(x => result.push(x[provider] as LiveDataPoint))
        return result
    }
}
export type LiveDataPointWithPrevious = LiveDataPoint & {
    previous: MinimalDataPoint | undefined
}