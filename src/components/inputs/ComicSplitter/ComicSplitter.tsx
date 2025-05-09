import { FILE_ACCEPTED_TYPES } from '@/constants'
import clsx from 'clsx'
import React, { useState, useRef } from 'react'
import { Rnd } from 'react-rnd' // Draggable and resizable

type Mode = 'line' | 'box'
type LineType = 'vertical' | 'horizontal'

interface BoxShape {
    type: 'box'
    x: number
    y: number
    width: number
    height: number
}
interface LineShape {
    type: 'line'
    lineType: LineType
    position: number
}
type Shape = BoxShape | LineShape

const ComicSplitter = () => {
    const [imageSrc, setImageSrc] = useState<string | null>(null)
    const [mode, setMode] = useState<Mode>('box')
    const [lineType, setLineType] = useState<LineType>('vertical')
    const [shapes, setShapes] = useState<Shape[]>([])
    const [isDrawing, setIsDrawing] = useState(false)
    const [startPoint, setStartPoint] = useState<{
        x: number
        y: number
    } | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => setImageSrc(e.target?.result as string)
            reader.readAsDataURL(file)
        }
    }

    const getRelativeCoords = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return { x: 0, y: 0 }
        const rect = containerRef.current.getBoundingClientRect()
        return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageSrc) return
        const coords = getRelativeCoords(e)
        setIsDrawing(true)
        setStartPoint(coords)

        if (mode === 'line') {
            setShapes((prev) => [
                ...prev,
                {
                    type: 'line',
                    lineType,
                    position: lineType === 'vertical' ? coords.x : coords.y,
                },
            ])
        }
    }

    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDrawing || mode !== 'box' || !startPoint) return
        const coords = getRelativeCoords(e)
        const width = coords.x - startPoint.x
        const height = coords.y - startPoint.y
        if (Math.abs(width) > 10 && Math.abs(height) > 10) {
            setShapes((prev) => [
                ...prev,
                {
                    type: 'box',
                    x: startPoint.x,
                    y: startPoint.y,
                    width,
                    height,
                },
            ])
        }
        setIsDrawing(false)
        setStartPoint(null)
    }

    const clearShapes = () => setShapes([])

    const sliceImage = () => {
        if (!imageSrc) return
        const img = new Image()
        img.src = imageSrc
        img.onload = () => {
            const slices = shapes.map((shape, index) => {
                if (shape.type !== 'box') return null
                const canvas = document.createElement('canvas')
                canvas.width = shape.width
                canvas.height = shape.height
                const ctx = canvas.getContext('2d')
                if (ctx)
                    ctx.drawImage(
                        img,
                        shape.x,
                        shape.y,
                        shape.width,
                        shape.height,
                        0,
                        0,
                        shape.width,
                        shape.height
                    )
                return { id: index, src: canvas.toDataURL('image/png') }
            })
            console.log('Sliced Images:', slices.filter(Boolean)) // Replace with actual UI
        }
    }

    return (
        <div className="p-4">
            <input
                className="file-input file-input-primary"
                type="file"
                accept={FILE_ACCEPTED_TYPES.map((type) => `.${type}`).join(',')}
                onChange={handleImageUpload}
            />
            <div className="flex space-x-4 mt-2">
                <button
                    type="button"
                    onClick={() => setMode('box')}
                    // className={mode === 'box' ? 'font-bold' : ''}
                    className={clsx('btn', {
                        'font-bold': mode === 'box',
                    })}
                >
                    Box Mode
                </button>
                <button
                    type="button"
                    onClick={() => setMode('line')}
                    className={clsx('btn', {
                        'font-bold': mode === 'box',
                    })}
                >
                    Line Mode
                </button>
                {mode === 'line' && (
                    <>
                        <button
                            type="button"
                            onClick={() => setLineType('vertical')}
                            className={
                                lineType === 'vertical' ? 'font-bold' : ''
                            }
                        >
                            Vertical
                        </button>
                        <button
                            type="button"
                            onClick={() => setLineType('horizontal')}
                            // className={
                            //     lineType === 'horizontal' ? 'font-bold' : ''
                            // }
                            className={clsx('btn', {
                                'font-bold': lineType === 'horizontal',
                            })}
                        >
                            Horizontal
                        </button>
                    </>
                )}
            </div>

            {imageSrc && (
                <div
                    ref={containerRef}
                    className="relative border mt-4 inline-block"
                >
                    <img
                        src={imageSrc}
                        alt="Comic"
                        className="block max-w-full"
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                    />

                    {shapes.map((shape, idx) =>
                        shape.type === 'box' ? (
                            <Rnd
                                key={idx}
                                default={{
                                    x: shape.x,
                                    y: shape.y,
                                    width: shape.width,
                                    height: shape.height,
                                }}
                                bounds="parent"
                                enableResizing
                                onResizeStop={(
                                    e,
                                    dir,
                                    ref,
                                    delta,
                                    position
                                ) => {
                                    setShapes((prev) =>
                                        prev.map((s, i) =>
                                            i === idx
                                                ? {
                                                      ...s,
                                                      ...position,
                                                      width: ref.offsetWidth,
                                                      height: ref.offsetHeight,
                                                  }
                                                : s
                                        )
                                    )
                                }}
                                onDragStop={(e, d) => {
                                    setShapes((prev) =>
                                        prev.map((s, i) =>
                                            i === idx
                                                ? { ...s, x: d.x, y: d.y }
                                                : s
                                        )
                                    )
                                }}
                            >
                                <div className="border-2 border-red-500 bg-opacity-30 bg-red-300 h-full w-full" />
                            </Rnd>
                        ) : (
                            <div
                                key={idx}
                                className="absolute bg-blue-500"
                                style={
                                    shape.lineType === 'vertical'
                                        ? {
                                              left: shape.position,
                                              top: 0,
                                              bottom: 0,
                                              width: '2px',
                                          }
                                        : {
                                              top: shape.position,
                                              left: 0,
                                              right: 0,
                                              height: '2px',
                                          }
                                }
                            ></div>
                        )
                    )}
                </div>
            )}

            <div className="mt-4 space-x-4">
                <button
                    type="button"
                    onClick={clearShapes}
                    className="p-2 border rounded"
                >
                    Clear
                </button>
                <button
                    type="button"
                    onClick={sliceImage}
                    className="p-2 border rounded bg-green-500 text-white"
                >
                    Slice Image
                </button>
            </div>
        </div>
    )
}

export default ComicSplitter
