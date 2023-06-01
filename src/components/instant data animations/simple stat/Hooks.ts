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

export type LiveDataDelta = {
    value: number
    delta: DataDelta
    type: string
}

export type LiveDataWithDelta = {
    tps: LiveDataDelta
    gps: LiveDataDelta
    gtps: LiveDataDelta
}

export const diff = (old: LiveDataDelta, newValue: number): LiveDataDelta => {
    return {
        value: newValue,
        delta: {
            type: old.value < newValue ? DeltaType.increase : DeltaType.decrease,
            value: Math.abs(old.value - newValue),
        },
        type: old.type
    }
}

export const useLiveDataWithDelta = () => {
    const [tps, setTPS] = useState<LiveDataDelta>({
        value: 0,
        delta: {
            type: DeltaType.increase,
            value: 0
        },
        type: 'tps'
    })
    const [gps, setGPS] = useState<LiveDataDelta>({
        value: 0,
        delta: {
            type: DeltaType.none,
            value: 0
        },
        type: 'gps'
    })
    const [gtps, setGTPS] = useState<LiveDataDelta>({
        value: 0,
        delta: {
            type: DeltaType.decrease,
            value: 0
        },
        type: 'gtps'
    })
    return {
        data: {
            tps: tps,
            gps: gps,
            gtps: gtps
        } as LiveDataWithDelta,
        setTPS: (value: number) => setTPS(prevState => diff(prevState, value)),
        setGPS: (value: number) => {
            setGPS(prevState => diff(prevState, value))
            setGTPS(prevState => diff(prevState, value / 21000))
        },
    }
}