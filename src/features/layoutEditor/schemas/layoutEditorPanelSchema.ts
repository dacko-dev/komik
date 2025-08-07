import { z } from 'zod'

export const LayoutEditorPanelSchema = z
    .object({
        id: z.string().uuid(),
        name: z.string().min(1, 'Panel name is required'),
        width: z.number().int().min(1, 'Width must be at least 1 pixel'),
        height: z.number().int().min(1, 'Height must be at least 1 pixel'),
        x: z.number().int().default(0),
        y: z.number().int().default(0),
        borderWidth: z
            .number()
            .int()
            .min(0, 'Border width must be at least 0 pixels')
            .default(1),
        borderRadius: z
            .number()
            .int()
            .min(0, 'Border radius must be at least 0 pixels')
            .default(0),
        borderColor: z.string().optional(),
    })
    .strict()

export type TLayoutEditorPanel = z.infer<typeof LayoutEditorPanelSchema>
