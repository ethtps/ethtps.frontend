import * as d3 from 'd3'
import { Vector2D } from '../../../..'


export type AreaPointPair = {
    initial: Vector2D,
    final: Vector2D
}

export type LinScale = d3.ScaleLinear<number, number>
export type TimeScale = d3.ScaleTime<number, number>

export type LinXYScale = {
    x: TimeScale | LinScale
    y: LinScale
}

export type PointPair = {
    initial: Vector2D
    final: Vector2D
}

export type PointPairInterpolator = {
    top: {
        x: (t: number) => number
        y: (t: number) => number
        points?: Partial<PointPair>
    }
    bottom: {
        x: (t: number) => number
        y: (t: number) => number
        points?: Partial<PointPair>
    }
}