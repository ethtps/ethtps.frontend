import { useState } from 'react'

export enum DeltaType {
    increase = 'increase',
    decrease = 'decrease',
    none = 'none'
}

export type DataDelta = {
    type: DeltaType
    value: number
}

export type LiveData = {
    value: number
    delta: DataDelta
    type: string
}

export const useLiveData = () => {
    const [tps, setTPS] = useState<LiveData>({
        value: 0,
        delta: {
            type: DeltaType.increase,
            value: 0
        },
        type: 'tps'
    })
    const [gps, setGPS] = useState<LiveData>({
        value: 0,
        delta: {
            type: DeltaType.none,
            value: 0
        },
        type: 'gps'
    })
    const [gtps, setGTPS] = useState<LiveData>({
        value: 0,
        delta: {
            type: DeltaType.decrease,
            value: 0
        },
        type: 'gtps'
    })
    return {
        tps: tps,
        gps: gps,
        gtps: gtps
    }
}