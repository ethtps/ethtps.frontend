function isColorTooLight(color: string) {
    // Return true if the color is too light, false otherwise
    // The threshold can be adjusted as needed
    const threshold = 160;
    const luminance = 0.2126 * parseInt(color.substr(1, 2), 16) + 0.7152 * parseInt(color.substr(3, 2), 16) + 0.0722 * parseInt(color.substr(5, 2), 16);
    return luminance > threshold;
}

function darkenColor(color: string) {
    // Darken the color by 40%
    const factor = 0.6;
    const r = Math.floor(parseInt(color.substr(1, 2), 16) * factor);
    const g = Math.floor(parseInt(color.substr(3, 2), 16) * factor);
    const b = Math.floor(parseInt(color.substr(5, 2), 16) * factor);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}


function darkenColorIfNecessary(color: string) {
    if (isColorTooLight(color)) {
        return darkenColor(color);
    }
    return color;
}

export { darkenColorIfNecessary }