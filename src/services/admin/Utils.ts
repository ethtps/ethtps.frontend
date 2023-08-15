import { useCallback, useEffect, useState } from 'react'

type Element = JSX.Element | React.ReactNode | undefined | null

export function conditionalRender(renderThis: Element, ifThis: boolean) {
    return ifThis ? renderThis : undefined
}

export function binaryConditionalRender(renderThis?: Element, orThis?: Element, ifThis?: boolean | unknown) {
    return ifThis ?? true ? renderThis : orThis
}

export function invertHexColor(hexColor: string): string {
    // Remove the '#' from the start of the string if it's present
    if (hexColor.startsWith('#')) {
        hexColor = hexColor.slice(1)
    }

    // If the hex color is in shorthand form, convert it to full form
    if (hexColor.length === 3) {
        hexColor = hexColor.split('').map(char => char + char).join('')
    }

    // Ensure valid hex color
    if (hexColor.length !== 6 || !/^([0-9a-f]{6})$/i.test(hexColor)) {
        throw new Error('Invalid hex color ' + hexColor)
    }

    // Invert color components
    const r = (255 - parseInt(hexColor.slice(0, 2), 16)).toString(16).padStart(2, '0')
    const g = (255 - parseInt(hexColor.slice(2, 4), 16)).toString(16).padStart(2, '0')
    const b = (255 - parseInt(hexColor.slice(4, 6), 16)).toString(16).padStart(2, '0')

    return '#' + r + g + b
}


function isColorTooLight(color: string) {
    // Return true if the color is too light, false otherwise
    // The threshold can be adjusted as needed
    const threshold = 160
    const luminance = 0.2126 * parseInt(color.substr(1, 2), 16) + 0.7152 * parseInt(color.substr(3, 2), 16) + 0.0722 * parseInt(color.substr(5, 2), 16)
    return luminance > threshold
}

function darkenColor(color: string) {
    // Darken the color by 40%
    const factor = 0.6
    const r = Math.floor(parseInt(color.substr(1, 2), 16) * factor)
    const g = Math.floor(parseInt(color.substr(3, 2), 16) * factor)
    const b = Math.floor(parseInt(color.substr(5, 2), 16) * factor)
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
}


export function darkenColorIfNecessary(color: string) {
    if (isColorTooLight(color)) {
        return darkenColor(color)
    }
    return color
}
export function useLoadedObject<T>(loader: () => Promise<T>) {
    const [data, setData] = useState<T>()
    const load = useCallback(() => {
        loader().then(setData)
    }, [])
    useEffect(load, [])
    return data
}
