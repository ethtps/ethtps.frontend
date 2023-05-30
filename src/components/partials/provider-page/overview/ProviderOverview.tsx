import { ProviderResponseModel } from "@/api-client"
import { AnalysisTab, CompareTab, DetailsTab, ProviderChartSection, SocialButtons, StatusTab, setQueryParams } from "@/components"
import { binaryConditionalRender, useColors } from "@/services"
import { Badge, Text, Box, Image, Tabs, Skeleton, TabList, TabPanel, Tab, TabPanels, SimpleGrid, Heading, Highlight } from "@chakra-ui/react"
// eslint-disable-next-line import/no-internal-modules
import { useRouter } from "next/router"
// eslint-disable-next-line import/no-internal-modules
import { useEffect, useState } from "react"

const iconSize = 65

export function ProviderOverview(props: {
    provider: ProviderResponseModel | undefined
}) {
    const provider = props.provider
    const router = useRouter()
    const [currentTab, setCurrentTab] = useState<string | undefined>()
    useEffect(() => {
        if (currentTab) {
            setQueryParams({ tab: currentTab })
        }
    }, [currentTab])
    const colors = useColors()
    return (
        <>
            <Box>
                <SimpleGrid
                    columns={2}
                    sx={{
                        padding: "1rem",
                    }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        {binaryConditionalRender(<Image
                            alt={`${provider?.name} icon`}
                            src={`/provider-icons/${provider?.name}.png`}
                            width={iconSize}
                            height={iconSize} />,
                            <Skeleton width={iconSize} height={iconSize} />, provider !== undefined)}
                        <Box>
                            <Box>
                                <Heading size={'md'}
                                    className="inline"
                                    variant="heading"
                                    sx={{
                                        cursor: "default",
                                    }}
                                >
                                    {provider?.name}
                                </Heading>
                                <Text
                                    order={5}
                                    variant="subheading"
                                    sx={{
                                        fontSize: "md",
                                        fontWeight: "bold",
                                        cursor: "default",
                                    }}
                                >
                                    0 TPS
                                </Text>
                            </Box>
                            <Text fontSize={'0.85rem'} style={{
                                cursor: "default",
                                marginTop: "0.425rem",
                            }}>
                                <Highlight
                                    query={props?.provider?.type ?? 'Unknown'}
                                    styles={{ px: '2', py: '1', rounded: 'full', bg: 'red.100' }}
                                >
                                    {props?.provider?.type ?? 'Unknown'}
                                </Highlight>
                            </Text>
                        </Box>
                    </Box>
                    <SimpleGrid
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            transform: "translateY(-1rem)",
                        }}>
                        <SocialButtons color={colors.text} />
                    </SimpleGrid>
                </SimpleGrid>
                <Box sx={{ padding: '1rem' }}>
                    <Tabs defaultValue="analysis" onChange={(v) => setCurrentTab(v?.toString())}>
                        <TabList>
                            <Tab>Overview</Tab>
                            <Tab>Details</Tab>
                            <Tab>Analysis</Tab>
                            <Tab>Compare</Tab>
                            <Tab>Status and data</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel pt="md">
                                <ProviderChartSection provider={provider?.name ?? undefined} />
                            </TabPanel>

                            <TabPanel pt="md">
                                <DetailsTab provider={provider} />
                            </TabPanel>

                            <TabPanel pt="md">
                                <AnalysisTab provider={provider} />
                            </TabPanel>

                            <TabPanel pt="md">
                                <CompareTab provider={provider} />
                            </TabPanel>

                            <TabPanel pt="xs">
                                <StatusTab provider={provider} />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box >
            </Box>
        </>
    )
}