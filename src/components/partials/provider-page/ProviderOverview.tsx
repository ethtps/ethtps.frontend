import { ProviderResponseModel } from "@/api-client";
import { ProviderChartSection, SocialButtons } from "@/components";
import { binaryConditionalRender, conditionalRender } from "@/services";
import { Badge, Group, Text, Box, Image, Tabs, Transition, Affix, Button, rem, Title, Skeleton } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";
import { IconChartRadar, IconTextCaption, IconChartBar, IconArrowUp } from "@tabler/icons-react";

const iconSize = 65

export function ProviderOverview(props: {
    provider: ProviderResponseModel | undefined
}) {
    const provider = props.provider
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
            <Affix position={{ bottom: rem(20), right: rem(20) }}>
                <Transition transition="slide-up" mounted={scroll.y > 0}>
                    {(transitionStyles) => (
                        <Button
                            leftIcon={<IconArrowUp size="1rem" />}
                            style={transitionStyles}
                            onClick={() => scrollTo({ y: 0 })}
                        >
                            Scroll to top
                        </Button>
                    )}
                </Transition>
            </Affix>
        </>
    )
}