import { useColorMode } from '@chakra-ui/react'

export interface Theme {
    primary: string
    secondary: string
    tertiary: string
    background: string
    text: string
    muted: string
    highlight: string
    gray: string
    gray1: string
    gray2: string
}

const lightTheme: Theme = {
    primary: '#B799FF',
    secondary: '#ACBCFF',
    tertiary: '#AEE2FF',
    background: '#FFFFFF',
    text: '#000000',
    muted: '#E6FFFD',
    highlight: '#D0F5BE',
    gray: 'gray.900',
    gray1: 'gray.50',
    gray2: 'gray.800'
}

const darkTheme: Theme = {
    primary: '#B799FF',
    secondary: '#ACBCFF',
    tertiary: '#AEE2FF',
    background: 'gray.900',
    text: 'white',
    muted: '#E6FFFD',
    highlight: '#D0F5BE',
    gray: 'gray.900',
    gray1: 'gray.800',
    gray2: 'gray.800'
}


/**
 * A custom hook to handle theme changes. Just use the values returned by this hook; no need to subscribe to any changes
 * @returns an object with the current theme colors
 */
export const useColors = () => {
    const { colorMode, toggleColorMode } = useColorMode()
    return colorMode === 'light' ? lightTheme : darkTheme
}