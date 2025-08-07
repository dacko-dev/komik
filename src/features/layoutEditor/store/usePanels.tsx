import { TLayoutEditorPanel } from '@/features/layoutEditor/schemas/layoutEditorPanelSchema'
import { create } from 'zustand'

type TPanelsState = {
    panels: TLayoutEditorPanel[]
    activePanelId: string | null
    addPanel: (panel: Omit<TLayoutEditorPanel, 'id'>) => void
    removePanel: (id: string) => void
    updatePanel: (id: string, updates: Partial<TLayoutEditorPanel>) => void
    setActivePanel: (id: string) => void
    movePanel: (fromIndex: number, toIndex: number) => void
    clearPanels: () => void
}

const dummyPanels: TLayoutEditorPanel[] = [
    {
        id: 'dummy-panel-1',
        name: 'Dummy Panel 1',
        width: 50,
        height: 80,
        x: 0,
        y: 0,
        borderWidth: 1,
        borderRadius: 0,
        borderColor: '#000000',
    },
    {
        id: 'dummy-panel-2',
        name: 'Dummy Panel 2',
        width: 60,
        height: 80,
        x: 100,
        y: 100,
        borderWidth: 2,
        borderRadius: 5,
        borderColor: '#FF0000',
    },
]

export const usePanels = create<TPanelsState>((set, get) => ({
    // layers: [],
    panels: dummyPanels,
    activePanelId: null,
    addPanel: (panel) =>
        set((state) => {
            const id = crypto.randomUUID()
            return {
                panels: [...state.panels, { ...panel, id }],
                activePanelId: id,
            }
        }),
    removePanel: (id) =>
        set((state) => ({
            panels: state.panels.filter((p) => p.id !== id),
            activePanelId:
                state.activePanelId === id ? null : state.activePanelId,
        })),
    updatePanel: (id, updates) =>
        set((state) => ({
            panels: state.panels.map((p) =>
                p.id === id ? { ...p, ...updates } : p
            ),
        })),
    setActivePanel: (id) =>
        set(() => ({
            activePanelId: id,
        })),
    movePanel: (fromIndex, toIndex) =>
        set((state) => {
            const panels = [...state.panels]
            const [moved] = panels.splice(fromIndex, 1)
            panels.splice(toIndex, 0, moved)
            return { panels }
        }),
    clearPanels: () => set({ panels: [], activePanelId: null }),
}))
