import { Button, ButtonProps, Group } from '@mantine/core';
import { IconBrandDiscord, IconBrandFacebook, IconBrandGithub, IconBrandGoogle, IconBrandMastodon, IconBrandReddit, IconBrandTwitter } from '@tabler/icons-react';
import { IconButton } from '../IconButton';
// eslint-disable-next-line import/no-internal-modules
import Link from 'next/link';

export function GoogleButton(props: ButtonProps) {
    return <Button leftIcon={<IconBrandGoogle />} variant="default" color="gray" {...props} />;
}


export function SocialButtons(props: {
    bottom?: boolean
}) {
    return (
        <Group sx={{ padding: 15 }}>
            <Link href="https://twitter.com/mantinedev" target="_blank">
                <IconButton
                    bottom={props.bottom}
                    visible
                    text='Tweet'
                    icon={< IconBrandTwitter />}
                />
            </Link>
            <Link href="https://twitter.com/mantinedev" target="_blank">
                <IconButton
                    bottom={props.bottom}
                    visible
                    text='Share on Reddit'
                    icon={< IconBrandReddit />}
                />
            </Link>
            <Link href="https://twitter.com/mantinedev" target="_blank">
                <IconButton
                    bottom={props.bottom}
                    visible
                    text='Share on Mastodon'
                    icon={< IconBrandMastodon />}
                />
            </Link>
            <Link href="https://twitter.com/mantinedev" target="_blank">
                <IconButton
                    bottom={props.bottom}
                    visible
                    text='Share on Facebook'
                    icon={<IconBrandFacebook />} />
            </Link>
        </Group>
    );
}