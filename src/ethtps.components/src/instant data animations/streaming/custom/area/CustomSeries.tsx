import { useEffect, useState } from "react"
import { Line } from "react-konva"
import { InstantDataAnimationProps } from "../../../../.."
import { linearMap } from "../../../../../../ethtps.data/src"

export function CustomSeries(props: Partial<InstantDataAnimationProps>) {
    const [mountTime, setMountTime] = useState<number>(Date.now())
    useEffect(() => {
        setMountTime(Date.now())
    }, [])
    const [data, setData] = useState<number[]>([])
    useEffect(() => {
        const eth = props.newestData?.['Ethereum']
        if (eth) {
            setData(old => {
                const x = linearMap(eth.data?.tps ?? 0, 0, 100, 0, (props.width ?? 0) / 2)
                const timeDelta = Date.now() - mountTime!
                const y = (timeDelta / (props.duration ?? 1)) * (props.height ?? 0)
                console.log(`x: ${x} y: ${y}`)
                old.push(...[x, y])
                return old
            })
        }
    }, [props.newestData])

    return <>
        <Line x={(props.width ?? 0) / 2} y={props.height} points={data} stroke={'white'} strokeEnabled strokeWidth={2} />

    </>
}