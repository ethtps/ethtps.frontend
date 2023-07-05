import { Button, ButtonProps, HStack, Stack } from '@chakra-ui/react'
import { IconBrandDiscord, IconBrandFacebook, IconBrandGithub, IconBrandGoogle, IconBrandMastodon, IconBrandReddit, IconBrandTwitter } from '@tabler/icons-react'
import { IconButton } from '../IconButton'
// eslint-disable-next-line import/no-internal-modules
import Link from 'next/link'

export function GoogleButton(props: ButtonProps) {
    return <Button leftIcon={<IconBrandGoogle />} variant="default" color="gray" {...props} />
}


export function SocialButtons(props: {
    bottom?: boolean,
    color?: string
}) {
    const sx = {
        color: props.color
    }
    return (
        <HStack sx={{ padding: 15 }}>
            <Link href="https://twitter.com/mantinedev" target="_blank">
                <IconButton
                    bottom={props.bottom}
                    visible
                    text='Tweet'
                    size={'40px'}
                    sx={{ ...sx }}
                    icon={< IconBrandTwitter />}
                />
            </Link>
            <Link href="https://twitter.com/mantinedev" target="_blank">
                <IconButton
                    size={'40px'}
                    bottom={props.bottom}
                    text='Share on Reddit'
                    sx={{ ...sx }}
                    icon={< IconBrandReddit />}
                />
            </Link>
            <Link href="https://twitter.com/mantinedev" target="_blank">
                <IconButton
                    bottom={props.bottom}
                    visible
                    size={'40px'}
                    text='Share on Mastodon'
                    sx={{ ...sx }}
                    icon={< IconBrandMastodon />}
                />
            </Link>
            <Link href="https://twitter.com/mantinedev" target="_blank">
                <IconButton
                    bottom={props.bottom}
                    visible
                    size={'40px'}
                    text='Share on Facebook'
                    sx={{ ...sx }}
                    icon={<IconBrandFacebook />} />
            </Link>
        </HStack>
    )
}