import { ProviderResponseModel } from "@/api-client";
import { ProviderChartSection, SocialButtons } from "@/components";
import { Badge, Group, Text, Box, Image, Tabs } from "@mantine/core";
import { IconChartRadar, IconTextCaption, IconChartBar } from "@tabler/icons-react";

const iconSize = 65

export function ProviderOverview(props: {
    provider: ProviderResponseModel | undefined
}) {
    const provider = props.provider
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
                    <Image
                        alt={`${provider?.name} icon`}
                        src={`/provider-icons/${provider?.name}.png`}
                        width={iconSize}
                        height={iconSize}
                    />
                    <Box>
                        <Box>
                            <Text
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
            </Group>
            <Box sx={{ padding: '1rem' }}>
                <Tabs defaultValue="overview">
                    <Tabs.List>
                        <Tabs.Tab value="overview" icon={<IconChartBar size="1rem" />}>Overview</Tabs.Tab>
                        <Tabs.Tab value="details" icon={<IconTextCaption size="1rem" />}>Details</Tabs.Tab>
                        <Tabs.Tab value="analysis" icon={<IconChartRadar size="1rem" />}>Analysis</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="overview" pt="md">
                        <ProviderChartSection />
                    </Tabs.Panel>

                    <Tabs.Panel value="details" pt="xs">
                        Details tab content
                    </Tabs.Panel>

                    <Tabs.Panel value="analysis" pt="xs">
                        Analysis tab content
                    </Tabs.Panel>
                </Tabs>
            </Box>
        </>
    )
}