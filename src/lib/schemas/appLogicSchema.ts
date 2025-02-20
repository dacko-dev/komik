import { FILE_ACCEPTED_TYPES, FILE_MAX_SIZE } from '@/constants'
import { byteToKb } from '@/lib/utils'
import { z } from 'zod'

export const fileSchema = z
    .instanceof(File)
    .refine((file) => {
        return file.size < 1024 * 1024 * 5
    }, `File size must be less than ${byteToKb(FILE_MAX_SIZE)}kb`)
    .refine((file) => {
        return FILE_ACCEPTED_TYPES.includes(file.type)
    }, `File type must be one of ${FILE_ACCEPTED_TYPES.map((type) => type.split('/')[1]).join(', ')}`)
