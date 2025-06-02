import { FILE_ACCEPTED_TYPES, FILE_MAX_SIZE } from '@/appConfig'
import { byteToKb } from '@/lib/utils'
import { z } from 'zod'

export const fileSchema = z
    .instanceof(File)
    .refine((file) => {
        return file.size < 1024 * 1024 * 5
    }, `File size must be less than ${byteToKb(FILE_MAX_SIZE)}kb`)
    .refine((file) => {
        return (FILE_ACCEPTED_TYPES as readonly string[]).includes(file.type)
    }, `File type must be one of ${FILE_ACCEPTED_TYPES.map((type) => type.split('/')[1]).join(', ')}`)

export const colorSchema = z.string().refine((color) => {
    // Check if the string is a valid hex color
    return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color)
}, 'Invalid color format. Use hex format (e.g., #RRGGBB or #RGB)')

export type TFileSchema = z.infer<typeof fileSchema>
export type TColorSchema = z.infer<typeof colorSchema>
