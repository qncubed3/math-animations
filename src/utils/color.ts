export function shuoldUseBlackText(hexColor: string): boolean {
    // Remove the # if present
    const hex = hexColor.replace('#', '');

    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate relative luminance using the sRGB color space formula
    // https://www.w3.org/TR/WCAG20/#relativeluminancedef
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return true (black text) if the background is bright (luminance > 0.5)
    return luminance > 0.5;
}