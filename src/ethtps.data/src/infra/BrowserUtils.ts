export function isClient() {
    return typeof window !== 'undefined'
}

export function isServer() {
    return !isClient()
}

export function isMobile() {
    return isClient() && window.innerWidth < 768
}

export function isTablet() {
    return isClient() && window.innerWidth < 992
}

export function isDesktop() {
    return isClient() && window.innerWidth > 992
}

export function isLargeDesktop() {
    return isClient() && window.innerWidth > 1200
}

export function isExtraLargeDesktop() {
    return isClient() && window.innerWidth > 1400
}

export function isLandscape() {
    return isClient() && window.innerWidth > window.innerHeight
}

export function isPortrait() {
    return isClient() && window.innerWidth < window.innerHeight
}

export function isTouchDevice() {
    return isClient() && 'ontouchstart' in window
}

export function isMouseDevice() {
    return isClient() && !isTouchDevice()
}