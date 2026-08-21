export function formatNumber (num) {
    const lessThanTen = num < 9 ? `0${num + 1}` : `${num + 1}`;
    return lessThanTen;
}