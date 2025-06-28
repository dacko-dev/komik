import React from 'react'

export default function DrawingBoardTabMenu({
    name = 'drawing_board_tabs',
}: {
    name?: string
}) {
    return (
        <div
            role="tablist"
            className="tabs tabs-sm tabs-box rounded-none h-[auto]"
        >
            <TabRadio
                name={name}
                label="Layers"
                value="layers"
                defaultChecked
            />
            <TabContent>
                <div className="flex flex-col gap-2">
                    <p>Layers</p>
                    <p>More content here</p>
                </div>
            </TabContent>
            <TabRadio name={name} label="Stickers" value="stickers" />
            <TabContent>
                <div className="flex flex-col gap-2">
                    <p>Stickers</p>
                    <p>More content here</p>
                </div>
            </TabContent>
        </div>
    )
}

function TabRadio({
    name,
    label,
    ...props
}: {
    name: string
    label: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            type="radio"
            name={name}
            className="tab font-bold"
            aria-label={label}
            {...props}
        />
    )
}

function TabContent({ children }: { children: React.ReactNode }) {
    return (
        <div className="p-6 mt-1 tab-content bg-base-100 border-base-300 rounded-field">
            {children}
        </div>
    )
}
