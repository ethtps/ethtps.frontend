import { AxisScale } from '@visx/axis'
import { VisHAxis, VisVAxis } from '.'
import { IComponentSize, WithMargins } from '../../../..'

export type IVisAxesProps = IComponentSize & Partial<WithMargins> & {
    parentDimensions: IComponentSize
    showControls?: boolean
    vScale?: AxisScale<number>
    hScale?: AxisScale<number>
    width: number
    height: number
    axisWidth: number
}

/**
 * Component for visualizing XY axes
 */
export function VisAxes(props: IVisAxesProps) {
    return <>
        <VisHAxis {...props}
            width={props.width}
            height={props.axisWidth}
            marginTop={props.height - props.axisWidth}
            scale={props.hScale} />
        <VisVAxis {...props}
            width={props.axisWidth}
            height={props.height - props.axisWidth}
            scale={props.vScale} />
    </>
}

//<VisVAxis scale={props.vScale} />