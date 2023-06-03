import { useColors } from "@/services"
import { ColorMode, Flex, Stack, Tooltip } from "@chakra-ui/react"
import { Link } from "@chakra-ui/react"
import { IconBrandTwitter, IconBrandDiscord, IconBrandGithub } from "@tabler/icons-react"

export function ThreeLinks() {
    const color = {
        color: useColors().text
    }
    return <>
        <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7} alignItems={'center'}>
                <Stack direction={'row'} spacing={7} alignItems={'center'}>
                    <Link href={'https://twitter.com/ethtps'}>
                        <Tooltip label="Follow us on Twitter" aria-label="twitter-button">
                            <IconBrandTwitter {...color} />
                        </Tooltip>
                    </Link>
                    <Link href={'https://discord.gg/jWPcsTzpCT'}>
                        <Tooltip label="Join our Discord channel" aria-label="discord-button">
                            <IconBrandDiscord size={'1.5rem'} {...color} />
                        </Tooltip>
                    </Link>
                    <Link href={'https://github.com/orgs/ethtps/repositories'}>
                        <Tooltip label="GitHub repo" aria-label="twitter-button">
                            <IconBrandGithub size={'1.5rem'} {...color} />
                        </Tooltip>
                    </Link>
                </Stack>
            </Stack>
        </Flex>
    </>
}