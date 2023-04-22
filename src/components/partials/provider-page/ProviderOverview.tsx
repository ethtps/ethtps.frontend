import { ProviderResponseModel } from "@/api-client";
import { SocialButtons } from "@/components";
import { Badge, Group, Text, Box, Image } from "@mantine/core";

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
                        <Text
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
                        <Badge>{provider?.type}</Badge>
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
                </Box>
                <Box sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                }}>
                    <SocialButtons />
                </Box>
            </Group>
        </>
    )
}