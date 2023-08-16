import { useCallback, useState } from 'react'
import { CustomButtonGroup } from '..'
import {
	EnumerateIntervals,
	ExtendedTimeInterval,
	TimeIntervalFromLabel,
	TimeIntervalToLabel,
	TimeIntervalToLabel_2,
} from '../../../../../ethtps.data/src'
import { binaryConditionalRender, useColors } from '../../../..'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { Menu, MenuButton, Button, MenuList, MenuItem } from '@chakra-ui/react'
import { IconClock2 } from '@tabler/icons-react'

interface ITimeIntervalButtonGroupProps {
	onChange?: (interval: ExtendedTimeInterval) => void
	loading?: boolean
	selected?: string
	shrink?: boolean
}

export function TimeIntervalButtonGroup({
	onChange,
	loading,
	selected,
	shrink,
}: ITimeIntervalButtonGroupProps): JSX.Element {
	const [current, setCurrent] = useState('1m')
	const colors = useColors()
	const change = useCallback((v: string) => {
		if (onChange) {
			onChange(
				TimeIntervalFromLabel(v) as ExtendedTimeInterval
			)
		}
		setCurrent(v)
	}, [onChange])
	return (
		<>
			<div
				style={{
					float: 'right',
					height: '1rem',
				}}>
				{binaryConditionalRender(<CustomButtonGroup
					onChange={change}
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
				/>,
					<>
						<Menu
							colorScheme={colors.chartBackground}
							matchWidth>
							<MenuButton
								sx={{
									bg: 'transparent',
								}}
								as={Button}
								leftIcon={<IconClock2 />}>
								{!loading ? current : selected}
							</MenuButton>
							<MenuList>
								{EnumerateIntervals().map((x, i) => {
									const v = TimeIntervalToLabel(x as ExtendedTimeInterval)
									return <MenuItem key={`timeinterval-${x}`} onClick={() => change(v)}>{v}</MenuItem>
								}
								)}
							</MenuList>
						</Menu>
					</>, !!!shrink)}
			</div>
		</>
	)
}
