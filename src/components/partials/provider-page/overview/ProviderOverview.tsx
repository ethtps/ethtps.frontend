import { ProviderResponseModel } from "@/api-client"
import { AnalysisTab, CompareTab, DetailsTab, ProviderChartSection, SocialButtons, StatusTab, setQueryParams } from "@/components"
import { binaryConditionalRender } from "@/services"
import { Badge, Stack, Text, Box, Image, Tabs, Skeleton, TabList, TabPanel, Tab } from "@chakra-ui/react"
import { useWindowScroll } from "@mantine/hooks"
import { IconChartRadar, IconTextCaption, IconChartBar, IconArrowUp, IconGeometry, IconDatabase, IconFingerprint, IconGauge } from "@tabler/icons-react"
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
    const [scroll, scrollTo] = useWindowScroll()
    return (
        <>
            <Stack
                dir="col"
                align={'self-end'}
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
                            <Text order={4}
                                className="inline"
                                variant="heading"
                                sx={{
                                    fontSize: "3xl",
                                    fontWeight: "bold",
                                    textTransform: "uppercase",
                                    letterSpacing: "wider",
                                    cursor: "default",
                                }}
                            >
                                {provider?.name}
                            </Text>
                            <Text
                                order={5}
                                variant="subheading"
                                color="gray"
                                sx={{
                                    fontSize: "md",
                                    fontWeight: "bold",
                                    cursor: "default",
                                }}
                            >
                                0 TPS
                            </Text>
                        </Box>
                        <Badge
                            size={'sm'}
                            color={'gray'}
                            className={'unselectable inline'}
                            sx={{ marginLeft: 0 }} // to add some space between the Text and the Badge
                        >
                            {provider?.type}
                        </Badge>
                    </Box>
                </Box>
                <Box sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    transform: "translateY(-1rem)",
                }}>
                    <SocialButtons />
                </Box>
            </Stack>
            <Box sx={{ padding: '1rem' }}>
                <Tabs defaultValue="analysis" onChange={(v) => setCurrentTab(v?.toString())}>
                    <TabList>
                        <Tab><Text>Overview</Text></Tab>
                        <Tab><Text>Details</Text></Tab>
                        <Tab><Text>Analysis</Text></Tab>
                        <Tab><Text>Compare</Text></Tab>
                        <Tab><Text>Status and data</Text></Tab>
                    </TabList>

                    <TabPanel pt="md">
                        <ProviderChartSection />
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
                </Tabs>
            </Box >
        </>
    )
}