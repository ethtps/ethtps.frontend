import { AxisScale } from '@visx/axis'
import { VisHAxis, VisVAxis } from '.'
import { Bounded, IComponentSize } from '../../../..'

export type IVisAxesProps = IComponentSize & Partial<Bounded> & {
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
        <VisVAxis {...props}
            width={props.axisWidth}
            height={props.height - (props.marginTop ?? 0) - (props.marginBottom ?? 0) - props.axisWidth}
            marginLeft={Math.max(props.axisWidth ?? 0, 18) / 2}
            scale={props.vScale} />
        <VisHAxis {...props}
            width={props.width}
            marginBottom={props.axisWidth / 2}
            paddingBottom={props.axisWidth / 2}
            height={props.axisWidth - props.axisWidth}
            marginTop={props.height - props.axisWidth}
            scale={props.hScale} />
    </>
}

//<VisVAxis scale={props.vScale} />