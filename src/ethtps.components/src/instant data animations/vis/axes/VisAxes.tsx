import { AxisScale } from '@visx/axis'
import { Translated, VisHAxis, VisVAxis, extend } from '.'
import { Bounded, IComponentSize } from '../../../..'
import { CSSProperties } from 'react'
import { MotionStyle } from 'framer-motion'

export type IVisAxesProps = IComponentSize & Partial<Bounded> & Partial<Translated> & {
    parentDimensions: IComponentSize
    showControls?: boolean
    vScale?: AxisScale<number>
    hScale?: AxisScale<number>
    width: number
    height: number
    axisWidth: number
    children?: React.ReactNode
}

/**
 * Component for visualizing XY axes
 */
export function VisAxes(props: IVisAxesProps) {
    const eprops = extend(props)
    const cleanProps = props as Omit<IVisAxesProps, 'xAxisSX' | 'yAxisSX'>
    return <>
        <VisVAxis {...cleanProps}
            ty={props.ty}
            width={props.width}
            axisWidth={props.axisWidth}
            height={props.height - eprops.verticalSize - props.axisWidth}
            marginLeft={Math.max(props.axisWidth ?? 0, 18) / 2}
            scale={props.vScale} />
        <VisHAxis {...cleanProps}
            tx={props.tx}
            width={props.width}
            marginBottom={props.axisWidth / 2}
            paddingBottom={props.axisWidth / 2}
            height={props.axisWidth - props.axisWidth}
            marginTop={props.height - props.axisWidth}
            scale={props.hScale} />
        {props.children}
    </>
}

//<VisVAxis scale={props.vScale} />