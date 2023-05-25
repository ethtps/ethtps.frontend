import { Stack, Tooltip, Text, Link } from "@chakra-ui/react"
// eslint-disable-next-line import/no-internal-modules

export default function CustomFooter() {
    return <>
        <footer >
            <Stack style={{ padding: '1rem' }} placeContent='apart'>
                <div>
                    <Text className={'inline'} size={'sm'}>
                        Brought to you by
                    </Text>
                    <Text className={'inline'} size={'sm'}>
                        <div style={{ marginLeft: '5px' }} className={'trick'}>
                            <span className='animated-cell'>Mister_Eth</span>
                        </div>
                    </Text>
                </div>
                <div style={{ float: 'right' }}>
                    <Stack>
                        <Link href={'/about'}>
                            <Text size={'sm'}>About</Text>
                        </Link>
                        <Link href={'/privacy-policy'}>
                            <Text size={'sm'}>Privacy policy</Text>
                        </Link>
                        <Link href={'https://ethtps.info?ref=v2_alpha'}>
                            <Text size={'sm'}>Old version</Text>
                        </Link>
                        <Link href={'https://mantine.dev?ref=ethtps.info'}>
                            <Text size={'sm'}>Built with Mantine</Text>
                        </Link>
                        <Tooltip
                            label={"First alpha version. It will get better :)"}>
                            <Text className={'unselectable'} size={'xs'}>
                                v1.5.0a1 ❤︎
                            </Text>
                        </Tooltip>
                    </Stack>
                </div>
            </Stack>
        </footer>
    </>
}