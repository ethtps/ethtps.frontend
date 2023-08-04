import { useColorMode } from '@chakra-ui/system'
import { useMemo } from 'react'


export interface Theme {
	primary: string
	primaryContrast: string
	secondary: string
	tertiary: string
	background: string
	backgroundLight: string
	text: string
	textContrast: string
	muted: string
	highlight: string
	crosshair: string
	gray: string
	gray1: string
	gray2: string
	topBarGradient: string
	grid: string
	chartBackground: string
	chartScaleBackgroundGradient: string
}

const lightTheme: Theme = {
	primary: '#B799FF',
	primaryContrast: '#000000',
	secondary: '#ACBCFF',
	tertiary: '#AEE2FF',
	background: '#FFFFFF',
	backgroundLight: '#FFFFFF',
	text: '#000000',
	textContrast: 'gray.900',
	muted: 'pink.50',
	highlight: '#D0F5BE',
	crosshair: '#000000',
	gray: 'gray.900',
	gray1: 'gray.50',
	gray2: 'gray.100',
	topBarGradient:
		'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(87,99,111,1) 35%, rgba(59,47,80,1) 100%)',
	grid: '#B799FF77',
	chartBackground: '#ffdede',
	chartScaleBackgroundGradient: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,222,222,0.4999482528023098) 18%, rgba(255,223,223,0.5030538428644216) 79%, rgba(255,223,223,0) 100%)'
}

const darkTheme: Theme = {
	primary: '#B799FF',
	primaryContrast: '#FFFFFF',
	secondary: '#8897d6',
	tertiary: '#385fb3',
	background: 'gray.900',
	backgroundLight: 'gray.800',
	text: 'white',
	textContrast: '#B799FF',
	muted: 'gray.750',
	highlight: '#D0F5BE',
	crosshair: '#FFFFFF',
	gray: 'gray.900',
	gray1: 'gray.800',
	gray2: 'gray.800',
	topBarGradient:
		'linear-gradient(0deg, #15141A 0%, #000706 50%, #15141A 100%)',
	grid: '#B799FF77',
	chartBackground: '#313e5a',
	chartScaleBackgroundGradient: 'linear-gradient(90deg, rgba(2,0,36,0) 0%, rgba(87,99,111,0.5) 35%, rgba(59,47,80,0) 100)'
}

/**
 * A custom hook to handle theme changes. Just use the values returned by this hook; no need to subscribe to any changes
 * @returns an object with the current theme colors
 */
export const useColors = () => {
	const { colorMode } = useColorMode()
	return useMemo(() => {
		return colorMode === 'light' ? lightTheme : darkTheme
	}, [colorMode])
}
