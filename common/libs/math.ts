export function round(num: number, dec = 2) {
    const d = Math.round(10 * dec);

    return Math.round((num + Number.EPSILON) * d) / d;
}
