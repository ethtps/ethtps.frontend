import { Axis, AxisScale, Orientation, SharedAxisProps } from '@visx/axis'
import { curveMonotoneX } from '@visx/curve'
import { LinearGradient } from '@visx/gradient'
import { GridColumns, GridRows } from '@visx/grid'
import { GridColumnsProps } from '@visx/grid/lib/grids/GridColumns'
import { GridRowsProps } from '@visx/grid/lib/grids/GridRows'
import { getSeededRandom } from '@visx/mock-data'
import { AnimatedAxis, AnimatedGridColumns, AnimatedGridRows } from '@visx/react-spring'
import { ScaleInput, coerceNumber, scaleLinear, scaleLog } from '@visx/scale'
import AreaClosed from '@visx/shape/lib/shapes/AreaClosed'
import React, { useMemo, useState } from 'react'
import { IComponentSize, WithMargins } from '../../..'

export const backgroundColor = '#da7cff'
const axisColor = '#fff'
const tickLabelColor = '#fff'
export const labelColor = '#340098'
const gridColor = '#6e0fca'
const seededRandom = getSeededRandom(0.5)

const tickLabelProps = {
    fill: tickLabelColor,
    fontSize: 12,
    fontFamily: 'sans-serif',
    textAnchor: 'middle',
} as const

const getMinMax = (vals: (number | { valueOf(): number })[]) => {
    const numericVals = vals.map(coerceNumber)
    return [Math.min(...numericVals), Math.max(...numericVals)]
}


type AnimationTrajectory = 'outside' | 'center' | 'min' | 'max' | undefined

type AxisComponentType = React.FC<
    SharedAxisProps<AxisScale> & {
        animationTrajectory: AnimationTrajectory
    }
>
type GridRowsComponentType = React.FC<
    GridRowsProps<AxisScale> & {
        animationTrajectory: AnimationTrajectory
    }
>
type GridColumnsComponentType = React.FC<
    GridColumnsProps<AxisScale> & {
        animationTrajectory: AnimationTrajectory
    }
>

export type IVisAxesProps = IComponentSize & Partial<WithMargins> & {
    parentDimensions: IComponentSize
    showControls?: boolean
    vScale?: AxisScale<number>
    hScale?: AxisScale<number>
}

/**
 * Component for visualizing XY axes
 */
export function VisAxes({
    width,
    height,
    parentDimensions,
    showControls = true,
    marginBottom = 10,
    marginLeft = 0,
    marginRight = 0,
    marginTop = 0,
}: IVisAxesProps) {
    // use non-animated components if prefers-reduced-motion is set
    const prefersReducedMotionQuery =
        typeof window === 'undefined' ? false : window.matchMedia('(prefers-reduced-motion: reduce)')
    const prefersReducedMotion = !prefersReducedMotionQuery || !!prefersReducedMotionQuery.matches
    const [useAnimatedComponents, setUseAnimatedComponents] = useState(!prefersReducedMotion)

    // in svg, margin is subtracted from total width/height
    const w = outerWidth - marginLeft - marginRight
    const h = outerHeight - marginBottom
    const [dataToggle, setDataToggle] = useState(true)
    const [animationTrajectory, setAnimationTrajectory] = useState<AnimationTrajectory>('center')

    // define some types
    interface AxisDemoProps<Scale extends AxisScale> extends SharedAxisProps<Scale> {
        values: ScaleInput<Scale>[]
    }

    const AxisComponent: AxisComponentType = useAnimatedComponents ? AnimatedAxis : Axis
    const GridRowsComponent: GridRowsComponentType = useAnimatedComponents
        ? AnimatedGridRows
        : GridRows
    const GridColumnsComponent: GridColumnsComponentType = useAnimatedComponents
        ? AnimatedGridColumns
        : GridColumns

    const axes: AxisDemoProps<AxisScale<number>>[] = useMemo(() => {
        // toggle between two value ranges to demo animation
        const linearValues = dataToggle ? [0, 2, 4, 6, 8, 10] : [6, 8, 10, 12]
        const bandValues = dataToggle ? ['a', 'b', 'c', 'd'] : ['d', 'c', 'b', 'a']
        const timeValues = dataToggle
            ? [new Date('2020-01-01'), new Date('2020-02-01')]
            : [new Date('2020-02-01'), new Date('2020-03-01')]
        const logValues = dataToggle ? [1, 10, 100, 1000, 10000] : [0.0001, 0.001, 0.1, 1, 10, 100]

        return [
            {
                scale: scaleLog({
                    domain: getMinMax(logValues),
                    range: [0, w],
                }),
                values: logValues,
                tickFormat: (v: number) => {
                    const asString = `${v}`
                    // label only major ticks
                    return asString.match(/^[.01?[\]]*$/) ? asString : ''
                },
                label: 'log',
            },
        ]
    }, [dataToggle, width])

    if (w < 10) return null

    const scalePadding = 40
    const scaleHeight = h / axes.length - scalePadding

    const yScale = scaleLinear({
        domain: [100, 0],
        range: [scaleHeight, 0],
    })

    return (
        <>
            <svg width={outerWidth} height={outerHeight}>
                <LinearGradient
                    id="visx-axis-gradient"
                    from={backgroundColor}
                    to={backgroundColor}
                    toOpacity={0.5}
                />
                <rect
                    x={0}
                    y={0}
                    width={outerWidth}
                    height={outerHeight}
                    fill={'url(#visx-axis-gradient)'}
                    rx={14}
                />
                <g transform={`translate(${marginLeft},${outerHeight - 50})`}>
                    {axes.map(({ scale, values, label, tickFormat }, i) => (
                        <g key={`scale-${i}`} transform={`translate(0, ${i * (scaleHeight + scalePadding)})`}>
                            <GridRowsComponent
                                // force remount when this changes to see the animation difference
                                key={`gridrows-${animationTrajectory}`}
                                scale={yScale}
                                stroke={gridColor}
                                width={w}
                                numTicks={dataToggle ? 1 : 3}
                                animationTrajectory={animationTrajectory}
                            />
                            <GridColumnsComponent
                                // force remount when this changes to see the animation difference
                                key={`gridcolumns-${animationTrajectory}`}
                                scale={scale}
                                stroke={gridColor}
                                height={scaleHeight}
                                numTicks={dataToggle ? 5 : 2}
                                animationTrajectory={animationTrajectory}
                            />
                            <AreaClosed
                                data={values.map((x) => [
                                    (scale(x) ?? 0) +
                                    // offset point half of band width for band scales
                                    ('bandwidth' in scale && typeof scale!.bandwidth !== 'undefined'
                                        ? scale.bandwidth!() / 2
                                        : 0),
                                    yScale(10 + seededRandom() * 90),
                                ])}
                                yScale={yScale}
                                curve={curveMonotoneX}
                                fill={gridColor}
                                fillOpacity={0.2}
                            />
                            <AxisComponent
                                // force remount when this changes to see the animation difference
                                key={`axis-${animationTrajectory}`}
                                orientation={Orientation.bottom}
                                top={scaleHeight}
                                scale={scale}
                                tickFormat={tickFormat}
                                stroke={axisColor}
                                tickStroke={axisColor}
                                tickLabelProps={tickLabelProps}
                                tickValues={label === 'log' || label === 'time' ? undefined : values}
                                numTicks={label === 'time' ? 6 : undefined}
                                label={label}
                                labelProps={{
                                    x: parseFloat(width?.toString() ?? '50') + 30,
                                    y: -10,
                                    fill: labelColor,
                                    fontSize: 18,
                                    strokeWidth: 0,
                                    stroke: '#fff',
                                    paintOrder: 'stroke',
                                    fontFamily: 'sans-serif',
                                    textAnchor: 'start',
                                }}
                                animationTrajectory={animationTrajectory}
                            />
                        </g>
                    ))}
                </g>
            </svg>
            {showControls && (
                <>
                    <div style={{ fontSize: 12 }}>
                        <label>
                            <input
                                type="checkbox"
                                onChange={() => setUseAnimatedComponents(!useAnimatedComponents)}
                                checked={useAnimatedComponents}
                            />{' '}
                            enable animation
                        </label>d
                        &nbsp;&nbsp;&nbsp;
                        {useAnimatedComponents && (
                            <>
                                <strong>animation trajectory</strong>
                                <label>
                                    <input
                                        type="radio"
                                        onChange={() => setAnimationTrajectory('outside')}
                                        checked={animationTrajectory === 'outside'}
                                    />{' '}
                                    outside
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        onChange={() => setAnimationTrajectory('center')}
                                        checked={animationTrajectory === 'center'}
                                    />{' '}
                                    center
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        onChange={() => setAnimationTrajectory('min')}
                                        checked={animationTrajectory === 'min'}
                                    />{' '}
                                    min
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        onChange={() => setAnimationTrajectory('max')}
                                        checked={animationTrajectory === 'max'}
                                    />{' '}
                                    max
                                </label>
                            </>
                        )}
                    </div>
                    {useAnimatedComponents && (
                        <button onClick={() => setDataToggle(!dataToggle)}>Update scales</button>
                    )}
                </>
            )}
        </>
    )
}