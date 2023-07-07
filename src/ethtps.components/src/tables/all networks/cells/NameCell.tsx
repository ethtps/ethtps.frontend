/* eslint-disable import/no-internal-modules */

import { HStack, Image, Link, Td, Text, Tooltip } from '@chakra-ui/react'
import { IconCloudOff, IconTriangleOff } from '@tabler/icons-react'
import NextLink from 'next/link'
import { conditionalRender, useColors } from '../../../..'
import { ICustomCellConfiguration } from './ICustomCellConfiguration'
export interface INameCellProps extends ICustomCellConfiguration {}

export function NameCell(config: INameCellProps): JSX.Element {
	const name = config.provider?.name ?? ''
	const colors = useColors()
	const hasIssues =
		(config.provider?.status?.isUnreliable ?? false) &&
		(config.provider?.status?.isProbablyDown ?? false)
	const noDataProvider = config.provider?.status === undefined
	return (
		<>
			<Td
				minW={'250px'}
				onClick={() =>
					config.clickCallback !== undefined
						? config.clickCallback(config.provider, 'Name')
						: () => {}
				}>
				<Tooltip
					hasArrow
					bgColor={colors.gray1}
					placement={'auto'}
					title={`Read more about ${name}`}>
					<HStack align={'center'}>
						<HStack>
							<Image
								alt={`${config.provider?.name} icon`}
								src={`/provider-icons/${config.provider?.name}.png`}
								className={'inline'}
								width={30}
								height={30}
								style={{ marginRight: '15px' }}></Image>
							<Link
								as={NextLink}
								color={'red'}
								className={'boldcell'}
								href={`/providers/${config.provider?.name?.replace(
									' ',
									'%20'
								)}`}>
								<Text color={colors.text}>
									{config.provider?.name}
								</Text>
							</Link>
						</HStack>
						{conditionalRender(
							<>
								<Tooltip
									hasArrow
									placement={'bottom'}
									title={`There are issues getting data for ${config.provider?.name} :/`}>
									<>
										<IconCloudOff className="inline small centered-vertically" />
									</>
								</Tooltip>
							</>,
							hasIssues && !noDataProvider
						)}
						{conditionalRender(
							<>
								<Tooltip
									hasArrow
									placement={'bottom'}
									title={`There is no data provider for ${config.provider?.name} :/`}>
									<>
										<IconTriangleOff className="spaced-horizontally" />
									</>
								</Tooltip>
							</>,
							noDataProvider
						)}
					</HStack>
				</Tooltip>
			</Td>
		</>
	)
}
