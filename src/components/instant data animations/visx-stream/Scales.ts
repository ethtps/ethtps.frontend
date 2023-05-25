import { scaleLinear, scaleOrdinal } from '@visx/scale'

export const NUM_LAYERS = 20
export const SAMPLES_PER_LAYER = 12
export const BUMPS_PER_LAYER = 10
export const BACKGROUND = '#ffdede'

export const range = (n: number) => Array.from(new Array(n), (_, i) => i)
export const keys = range(NUM_LAYERS)

type Datum = number[]
export const getY0 = (d: Datum) => yScale(d[0]) ?? 0
export const getY1 = (d: Datum) => yScale(d[1]) ?? 0



export const xScale = scaleLinear<number>({
    domain: [0, SAMPLES_PER_LAYER - 1],
})
export const yScale = scaleLinear<number>({
    domain: [-30, 50],
})
export const colorScale = scaleOrdinal<number, string>({
    domain: keys,
    range: ['#ffc409', '#f14702', '#262d97', 'white', '#036ecd', '#9ecadd', '#51666e'],
})
export const patternScale = scaleOrdinal<number, string>({
    domain: keys,
    range: ['mustard', 'cherry', 'navy', 'circles', 'circles', 'circles', 'circles'],
})