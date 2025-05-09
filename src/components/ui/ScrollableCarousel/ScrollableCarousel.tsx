import React, { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type ScrollableCarouselProps = {
    children: React.ReactNode
    wrapperClassName?: string // wrapper around entire component (incl. arrows)
    innerClassName?: string // wrapper around the scrollable children
}

export default function ScrollableCarousel({
    children,
    wrapperClassName = '',
    innerClassName = '',
}: ScrollableCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(false)

    const updateScrollButtons = () => {
        const container = scrollRef.current
        if (!container) return
        setCanScrollLeft(container.scrollLeft > 0)
        setCanScrollRight(
            container.scrollLeft + container.clientWidth <
                container.scrollWidth - 1
        )
    }

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return
        const scrollAmount = 200
        scrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        })
    }

    useEffect(() => {
        const container = scrollRef.current
        if (!container) return

        updateScrollButtons()

        container.addEventListener('scroll', updateScrollButtons)
        window.addEventListener('resize', updateScrollButtons)

        return () => {
            container.removeEventListener('scroll', updateScrollButtons)
            window.removeEventListener('resize', updateScrollButtons)
        }
    }, [])

    return (
        <div className={`relative overflow-x-auto ${wrapperClassName}`}>
            {canScrollLeft && (
                <button
                    type="button"
                    className="absolute left-2 z-10 btn btn-circle top-2/5"
                    onClick={() => scroll('left')}
                >
                    <ChevronLeft />
                </button>
            )}
            {canScrollRight && (
                <button
                    type="button"
                    className="absolute right-2 z-10 btn btn-circle top-2/5"
                    onClick={() => scroll('right')}
                >
                    <ChevronRight />
                </button>
            )}

            <div
                ref={scrollRef}
                className={`relative hide-scrollbar flex flex-nowrap overflow-x-auto items-center gap-4 ${innerClassName}`}
            >
                {children}
            </div>
        </div>
    )
}
