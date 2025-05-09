export function byteToKb(byte: number) {
    return byte / 1024
}

export function capitalizeFirst(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export function capitalizeAll(str: string) {
    return str
        .split(' ')
        .map((word) => capitalizeFirst(word))
        .join(' ')
}
