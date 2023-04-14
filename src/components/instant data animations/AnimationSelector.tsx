
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Direction, FramerBar, IComponentSize } from '..';
import { Carousel } from "@mantine/carousel"
import { createStyles, Paper, Text, Title, Button, useMantineTheme, rem, Group, Modal, Center } from '@mantine/core';
import { useDisclosure, useHover, useMediaQuery } from '@mantine/hooks';
import { conditionalRender } from '@/services';
import { IconChevronLeft, IconChevronRight, IconLayoutSidebarRightExpand, IconMaximize } from '@tabler/icons-react';
import { IconButton } from '../buttons/IconButton';
import { useViewportRatio } from '../hooks/ComponentHooks';

const useStyles = createStyles((theme) => ({
    card: {
        height: rem(440),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },

    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        fontWeight: 900,
        color: theme.white,
        lineHeight: 1.2,
        fontSize: rem(32),
        marginTop: theme.spacing.xs,
    },

    category: {
        color: theme.white,
        opacity: 0.7,
        fontWeight: 700,
        textTransform: 'uppercase',
    },
}));



enum Animations {
    bars
}

const tabs = [
    {
        label: "Bars",
        icon: "🍔",
    }
]

interface IAnimationSelectorProps extends IComponentSize {

}

const data = [{
    image:
        'https://images.unsplash.com/photo-1582721478779-0ae163c05a60?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
    title: 'Active volcanos reviews: travel at your own risk',
    category: 'nature',
}]
export function AnimationSelector(props: IAnimationSelectorProps) {
    const theme = useMantineTheme();
    const [modalOpened, { open, close }] = useDisclosure(false);
    const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
    const { hovered, ref } = useHover()
    const ratio = useViewportRatio()
    if (false)
        return <>
            <Modal
                opened={modalOpened}
                onClose={close}
                title="Authentication"
                centered>
                {conditionalRender(<>Nothing here yet</>, modalOpened)}
            </Modal>
            <div>
                <Carousel
                    ref={ref}
                    slideSize="50%"
                    breakpoints={[{ maxWidth: 'sm', slideSize: '100%', slideGap: rem(2) }]}
                    slideGap="xl"
                    align="start"
                    slidesToScroll={2}
                    withControls={hovered}
                >
                    <Carousel.Slide key={"bar-slide"}>
                        <Paper>
                            <IconButton
                                sx={{
                                    position: 'absolute',
                                    marginRight: 10
                                }}
                                visible={hovered}
                                text={'Maximize'}
                                onClick={open}
                                icon={<IconMaximize />} />
                            <Center mx="auto">
                                <Text style={{ position: 'relative' }}>{"You shouldn't be seeing this"}</Text>
                            </Center>
                            {conditionalRender(<FramerBar
                                width={props.width}
                                height={props.height} />, !modalOpened)}
                        </Paper>
                    </Carousel.Slide>
                </Carousel>
            </div>
        </>
    return <>
        <FramerBar
            width={props.width}
            height={props.height} />
    </>
}