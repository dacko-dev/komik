import { MAX_PANEL_COLUMNS } from '@/appConfig'

export function bestColumnsNumber(nOfItems: number): number {
    if (nOfItems <= 1) return 1

    let best = 1

    for (let cols = 1; cols <= Math.min(nOfItems, MAX_PANEL_COLUMNS); cols++) {
        if (nOfItems % cols === 0) {
            const rows = nOfItems / cols

            // Prioritize grids that are not a single row or single column (unless necessary)
            if (rows > 1 && cols > 1) {
                best = cols
            }
        }
    }

    // Fallback logic: if we end up with all in a single row, prefer splitting into ~half
    if (best === 1 && nOfItems > 1) {
        best = Math.min(MAX_PANEL_COLUMNS, Math.ceil(nOfItems / 2))
    }

    return best
}
