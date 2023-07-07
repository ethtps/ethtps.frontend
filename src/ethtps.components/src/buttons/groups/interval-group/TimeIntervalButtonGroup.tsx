import { useState } from 'react'
import { CustomButtonGroup } from '..'
import {
	EnumerateIntervals,
	ExtendedTimeInterval,
	TimeIntervalFromLabel,
	TimeIntervalToLabel,
	TimeIntervalToLabel_2,
} from '../../../../../ethtps.data/src'

interface ITimeIntervalButtonGroupProps {
	onChange?: (interval: ExtendedTimeInterval) => void
	loading?: boolean
	selected?: string
}

export function TimeIntervalButtonGroup({
	onChange,
	loading,
	selected,
}: ITimeIntervalButtonGroupProps): JSX.Element {
	const [current, setCurrent] = useState('1m')
	return (
		<>
			<div
				style={{
					float: 'right',
					height: '1rem',
				}}>
				<CustomButtonGroup
					onChange={(v) => {
						if (onChange) {
							onChange(
								TimeIntervalFromLabel(v) as ExtendedTimeInterval
							)
							setCurrent(v)
						}
					}}
					props={{
						variant: 'ghost',
						w: '1rem',
					}}
					selected={selected ?? '1m'}
					highlighed={loading ? current : undefined}
					tooltipFunction={(v) =>
						`Change view to ${TimeIntervalToLabel_2(
							v.toString()
						).toLowerCase()}`
					}
					buttons={EnumerateIntervals().map((x, i) =>
						TimeIntervalToLabel(x as ExtendedTimeInterval)
					)}
				/>
			</div>
		</>
	)
}
