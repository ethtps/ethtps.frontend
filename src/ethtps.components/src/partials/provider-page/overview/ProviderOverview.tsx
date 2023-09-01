// eslint-disable-next-line import/no-internal-modules
import { useRouter } from 'next/router'
// eslint-disable-next-line import/no-internal-modules
import {
	Box,
	Heading,
	Highlight,
	Image,
	SimpleGrid,
	Skeleton,
	Text
} from '@chakra-ui/react'
import {
	ETHTPSDataCoreModelsResponseModelsProviderResponseModel,
	ETHTPSDataIntegrationsMSSQLProviderLink,
} from 'ethtps.api'

import { useEffect } from 'react'
import {
	AnalysisTab,
	binaryConditionalRender,
	CompareTab,
	CustomGenericTabPanel,
	DetailsTab,
	IComponentSize,
	ProviderChartSection,
	setQueryParams,
	SocialButtons,
	StatusTab,
	useColors,
	useQueryStringAndLocalStorageBoundState,
} from '../../../..'
import { ETHTPSApi } from '../../../../../ethtps.data/src'

const iconSize = 65

export function ProviderOverview(
	props: {
		provider:
		| ETHTPSDataCoreModelsResponseModelsProviderResponseModel
		| undefined
		api: ETHTPSApi
		providerLinks?: ETHTPSDataIntegrationsMSSQLProviderLink[]
	} & IComponentSize
): JSX.Element {
	const provider = props.provider
	const router = useRouter()
	const [currentTab, setCurrentTab] = useQueryStringAndLocalStorageBoundState<
		string | undefined
	>(undefined, 'tab')
	useEffect(() => {
		if (currentTab) {
			setQueryParams({ tab: currentTab })
		}
	}, [currentTab])
	const colors = useColors()
	return (
		<>
			<SimpleGrid
				columns={2}
				sx={{
					padding: '1rem',
				}}>
				<Box
					sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
					{binaryConditionalRender(
						<Image
							alt={`${provider?.name} icon`}
							src={`/provider-icons-sm/${provider?.name}.png`}
							width={iconSize}
							height={iconSize}
						/>,
						<Skeleton width={iconSize} height={iconSize} />,
						provider !== undefined
					)}
					<Box>
						<Box>
							<Heading
								size={'md'}
								className="inline"
								variant="heading"
								sx={{
									cursor: 'default',
								}}>
								{provider?.name}
							</Heading>
							<Text
								order={5}
								variant="subheading"
								sx={{
									fontSize: 'md',
									fontWeight: 'bold',
									cursor: 'default',
								}}>
								0 TPS
							</Text>
						</Box>
						<Text
							fontSize={'0.85rem'}
							style={{
								cursor: 'default',
								marginTop: '0.425rem',
							}}>
							<Highlight
								query={props?.provider?.type ?? 'Unknown'}
								styles={{
									px: '2',
									py: '1',
									rounded: 'full',
									bg: 'red.100',
								}}>
								{props?.provider?.type ?? 'Unknown'}
							</Highlight>
						</Text>
					</Box>
				</Box>
				<SimpleGrid
					sx={{
						display: 'flex',
						justifyContent: 'flex-end',
						transform: 'translateY(-1rem)',
					}}>
					<SocialButtons color={colors.text} />
				</SimpleGrid>
			</SimpleGrid>
			<Box>
				<CustomGenericTabPanel localStorageKey={'providerTab'} items={[
					{
						title: 'Overview', content: <ProviderChartSection
							api={props.api}
							provider={provider?.name ?? undefined}
						/>
					},
					{ title: 'Details', content: <DetailsTab api={props.api} provider={provider} /> },
					{ title: 'Analysis', content: <AnalysisTab provider={provider} /> },
					{ title: 'Compare', content: <CompareTab provider={provider} /> },
					{ title: 'Status and data', content: <StatusTab provider={provider} /> },
				]} />
			</Box>
		</>
	)
}
