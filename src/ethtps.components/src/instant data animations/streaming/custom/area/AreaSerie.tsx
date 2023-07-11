import { Key, useEffect, useState } from "react"
import { Line } from "react-konva"
import { InstantDataAnimationProps, LiveDataPoint, dataExtractor, useColors } from "../../../../.."
import { linearMap } from "../../../../../../ethtps.data/src"

interface IAreaSerieProps extends Partial<InstantDataAnimationProps> {
    mountTime: number
    providerName: string
    lineColor?: string | null
    lineStrokeWidth?: number
    lineTension?: number
    fill?: string
    customKey: Key

}

export function AreaSerie(props: IAreaSerieProps) {
    const colors = useColors()
    const [data, setData] = useState<number[]>()
    useEffect(() => {
        setData([])
    }, [])
    useEffect(() => {
        const d = props.newestData?.[props.providerName]
        if (d && dataExtractor(d.data, props.dataType)) {
            setData(old => {
                const x = linearMap(dataExtractor(d.data, props.dataType) ?? 0, 0, 50, 0, (props.width ?? 0) / 2)
                const timeDelta = Date.now() - props.mountTime!
                const y = (timeDelta / (props.duration ?? 1)) * (props.height ?? 0)
                old ??= []
                old.push(...[x, y])
                return old
            })
        }
    }, [props.newestData])

    return <>
        <Line
            key={props.customKey}
            x={(props.width ?? 0) / 2}
            y={(props.height ?? 0) - (props.verticalPadding ?? 0)}
            points={data}
            stroke={props.lineColor ?? colors.text}
            strokeEnabled
            strokeWidth={props.lineStrokeWidth}
            tension={props.lineTension} />
    </>
}