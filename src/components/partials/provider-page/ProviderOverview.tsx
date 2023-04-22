import { SocialButtons } from "@/components";
import { Group, Text, Box, Image } from "@mantine/core";

const iconSize = 50

export function ProviderOverview({ currentProvider }: {
    currentProvider?: string
}) {
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
                        alt={`${currentProvider} icon`}
                        src={`/provider-icons/${currentProvider}.png`}
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
                            {currentProvider}
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