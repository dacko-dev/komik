import { z } from 'zod'

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

type TStringToZodType =
    | 'string'
    | 'number'
    | 'boolean'
    | 'date'
    | 'bigint'
    | 'undefined'
    | 'null'
    | 'any'
    | 'unknown'
    | 'array'
    | 'object'
    | 'map'
    | 'set'

export function stringToZodType(strType: TStringToZodType) {
    switch (strType) {
        case 'string':
            return z.string()
        case 'number':
            return z.number()
        case 'boolean':
            return z.boolean()
        case 'date':
            return z.date()
        case 'bigint':
            return z.bigint()
        case 'undefined':
            return z.undefined()
        case 'null':
            return z.null()
        case 'any':
            return z.any()
        case 'unknown':
            return z.unknown()
        case 'array':
            return z.array(z.unknown())
        case 'object':
            return z.object({})
        case 'map':
            return z.map(z.unknown(), z.unknown())
        case 'set':
            return z.set(z.unknown())
    }
}
