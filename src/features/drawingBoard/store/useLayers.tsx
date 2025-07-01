import { create } from 'zustand'

export type TLayer = {
    id: string
    name: string
    visible: boolean
    locked: boolean
}

type TLayersState = {
    layers: TLayer[]
    activeLayerId: string | null
    addLayer: (layer: Omit<TLayer, 'id'>) => void
    removeLayer: (id: string) => void
    updateLayer: (id: string, updates: Partial<TLayer>) => void
    setActiveLayer: (id: string) => void
    moveLayer: (fromIndex: number, toIndex: number) => void
    clearLayers: () => void
}

const dummyLayers: TLayer[] = [
    {
        id: 'layer1',
        name: 'Layer 1',
        visible: true,
        locked: false,
    },
    {
        id: 'layer2',
        name: 'Layer 2',
        visible: true,
        locked: false,
    },
    {
        id: 'layer3',
        name: 'Layer 3',
        visible: true,
        locked: false,
    },
]

export const useLayers = create<TLayersState>((set, get) => ({
    // layers: [],
    layers: dummyLayers,
    activeLayerId: null,

    addLayer: (layer) =>
        set((state) => {
            const id = crypto.randomUUID()
            return {
                layers: [...state.layers, { ...layer, id }],
                selectedLayerId: id,
            }
        }),

    removeLayer: (id) =>
        set((state) => ({
            layers: state.layers.filter((l) => l.id !== id),
            selectedLayerId:
                state.activeLayerId === id ? null : state.activeLayerId,
        })),

    updateLayer: (id, updates) =>
        set((state) => ({
            layers: state.layers.map((l) =>
                l.id === id ? { ...l, ...updates } : l
            ),
        })),

    setActiveLayer: (id) =>
        set(() => ({
            activeLayerId: id,
        })),

    moveLayer: (fromIndex, toIndex) =>
        set((state) => {
            const layers = [...state.layers]
            const [moved] = layers.splice(fromIndex, 1)
            layers.splice(toIndex, 0, moved)
            return { layers }
        }),

    clearLayers: () => set({ layers: [], activeLayerId: null }),
}))
