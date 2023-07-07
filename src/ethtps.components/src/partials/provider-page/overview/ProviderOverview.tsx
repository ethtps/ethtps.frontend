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
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Text,
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
							src={`/provider-icons/${provider?.name}.png`}
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
				<Tabs
					index={currentTab ? parseInt(currentTab) : 0}
					onChange={(v) => setCurrentTab(v?.toString())}>
					<TabList>
						<Tab>Overview</Tab>
						<Tab>Details</Tab>
						<Tab>Analysis</Tab>
						<Tab>Compare</Tab>
						<Tab>Status and data</Tab>
					</TabList>
					<TabPanels>
						<TabPanel pt="md" tabIndex={0}>
							<ProviderChartSection
								api={props.api}
								provider={provider?.name ?? undefined}
							/>
						</TabPanel>

						<TabPanel pt="md" tabIndex={1}>
							<DetailsTab
								providerLinks={props.providerLinks}
								provider={provider}
							/>
						</TabPanel>

						<TabPanel pt="md" tabIndex={2}>
							<AnalysisTab provider={provider} />
						</TabPanel>

						<TabPanel pt="md" tabIndex={3}>
							<CompareTab provider={provider} />
						</TabPanel>

						<TabPanel pt="xs" tabIndex={4}>
							<StatusTab provider={provider} />
						</TabPanel>
					</TabPanels>
				</Tabs>
			</Box>
		</>
	)
}
