import { Tooltip } from '@chakra-ui/react'
import { IconLink, IconLinkOff } from '@tabler/icons-react'
import { useState } from 'react'
import { IconButton, ISidechainToggleButtonConfiguration } from '..'
import {
	setIncludeSidechains,
	useAppDispatch,
} from '../../../../ethtps.data/src'

export function SidechainToggleButton(
	config: ISidechainToggleButtonConfiguration
): JSX.Element {
	const [on, setOn] = useState(config.defaultIncluded)
	const dispatch = useAppDispatch
	const toggle = () => {
		if (config.toggled) {
			config.toggled(!on)
			dispatch(setIncludeSidechains(!on))
		}
		setOn(!on)
	}
	return (
		<>
			<Tooltip
				hasArrow
				title={`Sidechains are ${
					on ? 'included' : 'excluded'
				}. Click to ${on ? 'exclude' : 'include'}`}>
				<IconButton
					onClick={toggle}
					icon={
						on ? <IconLink color="primary" /> : <IconLinkOff />
					}></IconButton>
			</Tooltip>
		</>
	)
}
