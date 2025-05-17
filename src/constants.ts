export const FILE_MAX_SIZE = 500 * 1024 // 500kb
export const FILE_ACCEPTED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
] as const

export const MAX_PANEL_ROWS = 4 as const
export const MAX_PANEL_COLUMNS = 4 as const
export const MAX_PANEL_COUNT = MAX_PANEL_ROWS * MAX_PANEL_COLUMNS
export const MIN_PANEL_COUNT = 1
