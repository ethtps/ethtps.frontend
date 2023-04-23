import { ProviderResponseModel } from "@/api-client";
import { AnalysisTab, CompareTab, DetailsTab, ProviderChartSection, SocialButtons, StatusTab, setQueryParams } from "@/components";
import { binaryConditionalRender } from "@/services";
import { Badge, Group, Text, Box, Image, Tabs, Transition, Affix, Button, rem, Title, Skeleton, NavLink } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { IconChartRadar, IconTextCaption, IconChartBar, IconArrowUp, IconGeometry, IconDatabase, IconFingerprint, IconGauge } from "@tabler/icons-react";
import { useRouter } from "next/router";
// eslint-disable-next-line import/no-internal-modules
import { useEffect, useState } from "react";

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
    const [scroll, scrollTo] = useWindowScroll();
    return (
        <>
            <Group
                dir="col"
                position="apart"
                align={'self-end'}
                grow
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
                            <Title order={4}
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
                            </Title>
                            <Title
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
                            </Title>
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
            </Group>
            <Box sx={{ padding: '1rem' }}>
                <Tabs defaultValue="analysis" onTabChange={(v) => setCurrentTab(v?.toString())}>
                    <Tabs.List>
                        <Tabs.Tab value="overview" icon={<IconChartBar size={"1" + (currentTab === "overview" ? ".3" : "") + "rem"} />}><Text>Overview</Text></Tabs.Tab>
                        <Tabs.Tab value="details" icon={<IconTextCaption size={"1" + (currentTab === "details" ? ".3" : "") + "rem"} />}><Text>Details</Text></Tabs.Tab>
                        <Tabs.Tab value="analysis" icon={<IconChartRadar size={"1" + (currentTab === "analysis" ? ".3" : "") + "rem"} />}><Text>Analysis</Text></Tabs.Tab>
                        <Tabs.Tab value="comparison" icon={<IconGeometry size={"1" + (currentTab === "comparison" ? ".3" : "") + "rem"} />}><Text>Compare</Text></Tabs.Tab>
                        <Tabs.Tab value="status" icon={<IconDatabase size={"1" + (currentTab === "status" ? ".3" : "") + "rem"} />}><Text>Status and data</Text></Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="overview" pt="md">
                        <ProviderChartSection />
                    </Tabs.Panel>

                    <Tabs.Panel value="details" pt="md">
                        <DetailsTab provider={provider} />
                    </Tabs.Panel>

                    <Tabs.Panel value="analysis" pt="md">
                        <AnalysisTab provider={provider} />
                    </Tabs.Panel>

                    <Tabs.Panel value="comparison" pt="md">
                        <CompareTab provider={provider} />
                    </Tabs.Panel>

                    <Tabs.Panel value="status" pt="xs">
                        <StatusTab provider={provider} />
                    </Tabs.Panel>
                </Tabs>
            </Box>
            <Affix position={{ bottom: rem(60), right: rem(20) }}>
                <Transition transition="slide-up" mounted={scroll.y > 100}>
                    {(transitionStyles) => (
                        <Button
                            leftIcon={<IconArrowUp size="1rem" />}
                            style={transitionStyles}
                            onClick={() => scrollTo({ y: 0 })}
                        >
                            Back up
                        </Button>
                    )}
                </Transition>
            </Affix>
        </>
    )
}