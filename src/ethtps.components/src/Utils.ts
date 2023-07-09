import queryString from 'query-string'

function isColorTooLight(color: string) {
	// Return true if the color is too light, false otherwise
	// The threshold can be adjusted as needed
	const threshold = 160
	const luminance =
		0.2126 * parseInt(color.substr(1, 2), 16) +
		0.7152 * parseInt(color.substr(3, 2), 16) +
		0.0722 * parseInt(color.substr(5, 2), 16)
	return luminance > threshold
}

function darkenColor(color: string) {
	// Darken the color by 40%
	const factor = 0.6
	const r = Math.floor(parseInt(color.substr(1, 2), 16) * factor)
	const g = Math.floor(parseInt(color.substr(3, 2), 16) * factor)
	const b = Math.floor(parseInt(color.substr(5, 2), 16) * factor)
	return `#${r.toString(16).padStart(2, '0')}${g
		.toString(16)
		.padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

function darkenColorIfNecessary(color: string) {
	if (isColorTooLight(color)) {
		return darkenColor(color)
	}
	return color
}

interface IQueryParams {
	tab: string
	section: string
	subsection: string
}

const setQueryParams = (params: Partial<IQueryParams>) => {
	if (typeof window === 'undefined') return
	const currentSearch = window.location.search
	const parsedSearch = queryString.parse(currentSearch)
	const newSearch = queryString.stringify({ ...parsedSearch, ...params })
	const newUrl = `${window.location.origin}${window.location.pathname}?${newSearch}`
	window.history.pushState({ path: newUrl }, '', newUrl)
}

import React from 'react'

export const conditionalRender = (
	component: JSX.Element,
	renderIf?: boolean
) => {
	return renderIf
		? component
		: React.createElement('div', {
			className: 'placeholder',
		})
}

export const binaryConditionalRender = (
	componentIf?: JSX.Element,
	componentIfNot?: JSX.Element,
	renderIf?: boolean
) => {
	return renderIf ? componentIf : componentIfNot
}
/*
export const ConditionalSkeletonRender = (
  component?: JSX.Element,
  renderIf?: boolean
) => {
  return renderIf ? component : React.createElement(SkeletonWithTooltip)
}*/
interface IconTypeProps {
	width: number
	height: number
	color: string
}

export type IconType = (props: IconTypeProps) => JSX.Element

export type DropdownOptionWithIcon<T> =
	| {
		value: T
		icon?: IconType
	}
	| undefined

export function createDropdownOptionWithIcon<T>(
	value: T,
	icon?: IconType
): DropdownOptionWithIcon<T> {
	return {
		value,
		icon,
	}
}

export function capitalizeFirstLetter(str?: string | null) {
	if (!str) return undefined
	return str.charAt(0).toUpperCase() + str.slice(1)
}

export { darkenColorIfNecessary, setQueryParams }
export type { IQueryParams }

export function getRelativeMousePosition(e: any) {
	const parentRect = e.currentTarget.getBoundingClientRect()
	return {
		x: e.clientX - parentRect.left,
		y: e.clientY - parentRect.top,
	}
}