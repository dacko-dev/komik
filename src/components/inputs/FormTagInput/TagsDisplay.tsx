import { XIcon } from 'lucide-react'
import React from 'react'

function TagsDisplay({
    tags,
    onTagClick,
}: {
    tags: string[]
    onTagClick?: (tag: string) => void
}) {
    if (!tags || tags.length === 0) {
        return null
    }

    return (
        <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag: string) => (
                <button
                    type="button"
                    onClick={() => onTagClick && onTagClick(tag)}
                    key={tag}
                    className="btn font-light badge badge-ghost"
                >
                    <span>
                        <span className="text-blue-400">#</span>

                        {`${tag}`}
                    </span>
                    <XIcon className="w-4 h-4" />
                </button>
            ))}
        </div>
    )
}

export default React.memo(TagsDisplay)

{
    /* <div className="flex flex-wrap gap-2 mt-2">
                                    {field.value.map((tag: string) => (
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            key={tag}
                                            className="btn font-light badge badge-accent"
                                        >
                                            {tag}

                                            <XIcon className="w-4 h-4" />
                                        </button>
                                    ))}
                                </div> */
}
