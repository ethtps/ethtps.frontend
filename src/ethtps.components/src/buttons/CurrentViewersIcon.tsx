import { Tooltip } from '@chakra-ui/react'
import { IconEye } from '@tabler/icons-react'
import { IconButton } from './IconButton'

export function CurrentViewersIcon(): JSX.Element {
	return (
		<>
			<Tooltip hasArrow title={'Nobody&aposs here'}>
				<IconButton icon={<IconEye />}></IconButton>
			</Tooltip>
		</>
	)
}
