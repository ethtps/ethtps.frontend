import Konva from "konva"
import React, { Key, useEffect, useState } from "react"
import { Shape } from "react-konva"
import { InstantDataAnimationProps, dataExtractor, useColors } from "../../../../.."
import { L2DataUpdateModel, linearMap } from "../../../../../../ethtps.data/src"

interface IAreaSerieProps extends Partial<InstantDataAnimationProps> {
    mountTime: number
    providerName: string
    lineColor?: string | null
    lineStrokeWidth?: number
    lineTension?: number
    fill?: string
    customKey: Key

}

type L2DataUpdateModelWithTimestamp = L2DataUpdateModel & { timestamp: number }

export function AreaSerie(props: IAreaSerieProps) {
    const colors = useColors()
    const [data, setData] = useState<number[]>()
    const [allData, setAllData] = useState<L2DataUpdateModelWithTimestamp[]>([])
    useEffect(() => {
        setData([])
    }, [])
    const shapeRef = React.useRef<Konva.Shape>(new Konva.Shape())
    useEffect(() => {
        const d = props.newestData?.[props.providerName]
        if (d && dataExtractor(d.data, props.dataType)) {
            setAllData(old => [...old, {
                data: d.data,
                provider: d.provider,
                timestamp: Date.now()
            }])
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
    const xAt = (t: number) => linearMap(dataExtractor(allData[t]?.data, props.dataType) ?? 0, 0, 50, 0, (props.width ?? 0) / 2)
    const yAt = (timestamp: number) => ((timestamp - props.mountTime!) / (props.duration ?? 1)) * (props.height ?? 0)
    return (
        <Shape
            ref={shapeRef}
            key={props.customKey}
            x={(props.width ?? 0) / 2}
            y={(props.height ?? 0) - (props.verticalPadding ?? 0)}
            sceneFunc={(context, shape) => {
                if (!data || data.length === 0) {
                    return
                }

                context.beginPath()
                context.moveTo(0, 0)

                allData.forEach((d, i) => {
                    const x = xAt(i)
                    const y = ((allData[i].timestamp - props.mountTime!) / (props.duration ?? 1)) * (props.height ?? 0)
                    context.lineTo(x, y)
                })

                for (let i = allData.length - 1; i >= 0; i--) {
                    const x = xAt(i)
                    const y = ((allData[i].timestamp - props.mountTime!) / (props.duration ?? 1)) * (props.height ?? 0)
                    context.lineTo(-x, y)
                }

                context.closePath()
                context.fillStrokeShape(shape)
            }}
            stroke={props.lineColor ?? colors.text}
            strokeEnabled
            fill={props.fill}
            strokeWidth={props.lineStrokeWidth}
            tension={props.lineTension} />
    )
}

/**
 *  <Line
            key={props.customKey}
            x={(props.width ?? 0) / 2}
            y={(props.height ?? 0) - (props.verticalPadding ?? 0)}
            points={data}
            stroke={props.lineColor ?? colors.text}
            strokeEnabled
            strokeWidth={props.lineStrokeWidth}
            tension={props.lineTension} />

*/