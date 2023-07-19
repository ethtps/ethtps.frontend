import { MinimalDataPoint, TransactionMetadata } from '.'
import { LiveDataPointKey, StackKey } from '../StackKey'



export class LiveDataPoint implements MinimalDataPoint, StackKey<LiveDataPointKey> {
    /**
     * Unix timestamp in milliseconds
     */
    public x?: number
    public get y(): Partial<MinimalDataPoint> {
        return {
            tps: this.tps,
            gps: this.gps,
            gtps: this.gtps,
        }
    }
    /**
     * Usually the provider name
     */
    public z?: string
    public tps?: number
    public gps?: number
    public readonly gtps?: number = (this.gps ?? 0) / 21000
    public transactions?: TransactionMetadata[]
    public compare(other: LiveDataPoint): boolean {
        return this.tps === other.tps && this.gps === other.gps
    }
    public toString(): string {
        return `${this.z}@${this.x}`
    }

    public get key(): LiveDataPointKey {
        this._key ??= {
            provider: this.z ?? '',
            x: this.x ?? 0
        }
        return this._key!
    }
    private _key?: LiveDataPointKey
}