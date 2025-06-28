import { TColorSchema, TContentVisibility, TReadingMode } from '@/types'

export const FILE_MAX_SIZE = 500 * 1024 // 500kb
export const FILE_ACCEPTED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
] as const

export const MAX_PANEL_COLUMNS = 4 as const
export const MAX_PANEL_COUNT = 16 as const
export const MIN_PANEL_COUNT = 1
export const MAX_GAP_SIZE = 40 // px
export const MAX_BORDER_WIDTH = 10 // px

export const PANEL_ROUNDED_VALUE = 15 // px

export const APP_DEFAULTS: {
    panelColumns: number
    borderWidth: number // px
    isRounded: boolean
    gapRow: number // px
    gapCol: number // px
    readingMode: TReadingMode
    backgroundColor: TColorSchema
    contentVisibility: TContentVisibility
} = {
    panelColumns: 1,
    borderWidth: 0,
    isRounded: false,
    gapRow: 0,
    gapCol: 0,
    readingMode: 'leftToRight',
    backgroundColor: '#ffffff',
    contentVisibility: 'public',
}
