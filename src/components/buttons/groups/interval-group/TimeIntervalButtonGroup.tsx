import { TimeInterval } from "@/api-client"
import { CustomButtonGroup } from "@/components"
import { EnumerateIntervals, TimeIntervalFromLabel, TimeIntervalToLabel, TimeIntervalToLabel_2 } from "@/data"

interface ITimeIntervalButtonGroupProps {
    onChange?: (interval: TimeInterval) => void
}

export function TimeIntervalButtonGroup({ onChange }: ITimeIntervalButtonGroupProps) {
    return <>
        <div style={{
            float: 'right',
            height: '1rem',
        }}>
            <CustomButtonGroup
                onChange={(v) => {
                    if (onChange) {
                        onChange(TimeIntervalFromLabel(v))
                    }
                }}
                props={{
                    variant: 'ghost',
                    w: '1rem'
                }}
                selected="1m"
                tooltipFunction={(v) => `Change to ${TimeIntervalToLabel_2(v.toString()).toLowerCase()}`}
                buttons={EnumerateIntervals().map((x, i) => TimeIntervalToLabel(x))} />
        </div>
    </>
}