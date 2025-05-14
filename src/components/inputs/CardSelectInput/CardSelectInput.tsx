import { ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { InputHTMLAttributes } from 'react'

type CardSelectInputProps = {
    label: string
    thumbnail?: string | null
} & InputHTMLAttributes<HTMLInputElement>

export default function CardSelectInput({
    label,
    thumbnail,
    ...inputProps
}: CardSelectInputProps) {
    const { id, checked } = inputProps

    return (
        <div
            className={`flex flex-col shrink-0 rounded-sm overflow-hidden border-2 transition-all
        ${
            checked
                ? 'bg-secondary text-secondary-content border-secondary'
                : 'bg-base-200 border-base-200'
        }
      `}
        >
            <label
                htmlFor={id}
                className="cursor-pointer h-full w-full flex flex-col items-center justify-center"
            >
                <div className="w-full grow aspect-square flex items-center justify-center overflow-hidden rounded-sm">
                    {thumbnail ? (
                        <Image
                            src={thumbnail}
                            alt={label}
                            className="w-full grow h-full object-cover object-center"
                            width={200}
                            height={100}
                        />
                    ) : (
                        <div className="w-full h-auto flex items-center justify-center">
                            <ImageIcon />
                        </div>
                    )}
                </div>

                {/* TODO: Fix label wrapping */}
                <div
                    title={label}
                    className="text-sm text-center p-1  w-full truncate"
                >
                    {label}
                </div>
            </label>

            <input
                {...inputProps}
                className={`hidden ${inputProps.className}`}
            />
        </div>
    )
}
