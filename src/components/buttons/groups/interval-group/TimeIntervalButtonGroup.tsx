import { CustomButtonGroup } from "@/components"
import { EnumerateIntervals, ExtendedTimeInterval, TimeIntervalFromLabel, TimeIntervalToLabel, TimeIntervalToLabel_2 } from "@/data"
import { useState } from "react"

interface ITimeIntervalButtonGroupProps {
    onChange?: (interval: ExtendedTimeInterval) => void
    loading?: boolean
    selected?: string
}

export function TimeIntervalButtonGroup({ onChange, loading, selected }: ITimeIntervalButtonGroupProps) {
    const [current, setCurrent] = useState("1m")
    return <>
        <div style={{
            float: 'right',
            height: '1rem',
        }}>
            <CustomButtonGroup
                onChange={(v) => {
                    if (onChange) {
                        onChange(TimeIntervalFromLabel(v))
                        setCurrent(v)
                    }
                }}
                props={{
                    variant: 'ghost',
                    w: '1rem'
                }}
                selected={selected ?? '15m'}
                highlighed={loading ? current : undefined}
                tooltipFunction={(v) => `Change view to ${TimeIntervalToLabel_2(v.toString()).toLowerCase()}`}
                buttons={EnumerateIntervals().map((x, i) => TimeIntervalToLabel(x))} />
        </div>
    </>
}