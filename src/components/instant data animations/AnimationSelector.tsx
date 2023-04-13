
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FramerBar, IComponentSize } from '..';
import { Carousel } from "@mantine/carousel"
import { createStyles, Paper, Text, Title, Button, useMantineTheme, rem, Group, Modal } from '@mantine/core';
import { useDisclosure, useHover, useMediaQuery } from '@mantine/hooks';
import { conditionalRender } from '@/services';
import { IconChevronLeft, IconChevronRight, IconLayoutSidebarRightExpand, IconMaximize } from '@tabler/icons-react';
import { IconButton } from '../buttons/IconButton';

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

let barChart: any = undefined;

export function AnimationSelector(props: IAnimationSelectorProps) {
    const theme = useMantineTheme();
    const [modalOpened, { open, close }] = useDisclosure(false);
    const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
    const { hovered, ref } = useHover()
    const getBarChart = () => {
        barChart ??= <FramerBar width={props.width} height={props.height} />
        return barChart
    }
    return <>
        <Modal
            opened={modalOpened}
            onClose={close}
            title="Authentication"
            centered>
            {conditionalRender(getBarChart(), modalOpened)}
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
                        {conditionalRender(getBarChart(), !modalOpened)}
                    </Paper>
                </Carousel.Slide>
            </Carousel>
        </div>
    </>
}