import React, { useState, useRef } from 'react'

type Mode = 'line' | 'box'
type LineType = 'vertical' | 'horizontal'

interface ComicSplitterProps {
    imageSrc: string
    mode: Mode // whether user is drawing lines or boxes
    // For line mode, decide which type of line (vertical or horizontal)
    lineType?: LineType
    // For box mode, these constraints apply:
    minWidth?: number
    maxWidth?: number
    minHeight?: number
    maxHeight?: number
}

// Define shape types for drawn boundaries
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
    position: number // x for vertical, y for horizontal
}
type Shape = BoxShape | LineShape

const ComicSplitter: React.FC<ComicSplitterProps> = ({
    imageSrc,
    mode,
    lineType = 'vertical',
    minWidth = 50,
    maxWidth = 1000,
    minHeight = 50,
    maxHeight = 1000,
}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [shapes, setShapes] = useState<Shape[]>([])
    const [isDrawing, setIsDrawing] = useState(false)
    const [startPoint, setStartPoint] = useState<{
        x: number
        y: number
    } | null>(null)
    const [currentShape, setCurrentShape] = useState<Shape | null>(null)

    // Convert mouse event to coordinates relative to container
    const getRelativeCoords = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return { x: 0, y: 0 }
        const rect = containerRef.current.getBoundingClientRect()
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        }
    }

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const coords = getRelativeCoords(e)
        setIsDrawing(true)
        setStartPoint(coords)
        if (mode === 'line') {
            // For line mode, create a new line shape immediately.
            const newLine: LineShape = {
                type: 'line',
                lineType,
                position: lineType === 'vertical' ? coords.x : coords.y,
            }
            setCurrentShape(newLine)
        } else if (mode === 'box') {
            // For box mode, initialize a box shape.
            const newBox: BoxShape = {
                type: 'box',
                x: coords.x,
                y: coords.y,
                width: 0,
                height: 0,
            }
            setCurrentShape(newBox)
        }
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDrawing || !startPoint || !currentShape) return
        const coords = getRelativeCoords(e)
        if (mode === 'box' && currentShape.type === 'box') {
            // Calculate new width and height based on startPoint.
            const newWidth = coords.x - startPoint.x
            const newHeight = coords.y - startPoint.y
            setCurrentShape({
                type: 'box',
                x: startPoint.x,
                y: startPoint.y,
                width: newWidth,
                height: newHeight,
            })
        }
        // For line mode, we assume the line is set on click.
    }

    const handleMouseUp = () => {
        if (!isDrawing || !currentShape) return
        setIsDrawing(false)
        // For box mode, validate dimensions
        if (currentShape.type === 'box') {
            const box = currentShape
            if (
                Math.abs(box.width) < minWidth ||
                Math.abs(box.width) > maxWidth ||
                Math.abs(box.height) < minHeight ||
                Math.abs(box.height) > maxHeight
            ) {
                // Discard the box if it doesn't meet the size criteria.
                setCurrentShape(null)
                setStartPoint(null)
                return
            }
            // Normalize box dimensions so width and height are positive.
            const normalizedBox: BoxShape = {
                type: 'box',
                x: box.width < 0 ? box.x + box.width : box.x,
                y: box.height < 0 ? box.y + box.height : box.y,
                width: Math.abs(box.width),
                height: Math.abs(box.height),
            }
            setShapes((prev) => [...prev, normalizedBox])
        } else if (currentShape.type === 'line') {
            // For line mode, add the line as-is.
            setShapes((prev) => [...prev, currentShape])
        }
        setCurrentShape(null)
        setStartPoint(null)
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Comic Splitter Editor</h2>
            <div
                ref={containerRef}
                className="relative border"
                style={{ display: 'inline-block' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                <img src={imageSrc} alt="Comic" className="block max-w-full" />
                {/* Render finalized shapes */}
                {shapes.map((shape, idx) => {
                    if (shape.type === 'box') {
                        return (
                            <div
                                key={idx}
                                style={{
                                    position: 'absolute',
                                    left: shape.x,
                                    top: shape.y,
                                    width: shape.width,
                                    height: shape.height,
                                    border: '2px dashed red',
                                    pointerEvents: 'none',
                                }}
                            ></div>
                        )
                    } else if (shape.type === 'line') {
                        if (shape.lineType === 'vertical') {
                            return (
                                <div
                                    key={idx}
                                    style={{
                                        position: 'absolute',
                                        left: shape.position,
                                        top: 0,
                                        bottom: 0,
                                        width: '2px',
                                        backgroundColor: 'blue',
                                        pointerEvents: 'none',
                                    }}
                                ></div>
                            )
                        } else {
                            return (
                                <div
                                    key={idx}
                                    style={{
                                        position: 'absolute',
                                        top: shape.position,
                                        left: 0,
                                        right: 0,
                                        height: '2px',
                                        backgroundColor: 'blue',
                                        pointerEvents: 'none',
                                    }}
                                ></div>
                            )
                        }
                    }
                    return null
                })}
                {/* Render current shape being drawn */}
                {currentShape && currentShape.type === 'box' && (
                    <div
                        style={{
                            position: 'absolute',
                            left: (currentShape as BoxShape).x,
                            top: (currentShape as BoxShape).y,
                            width: (currentShape as BoxShape).width,
                            height: (currentShape as BoxShape).height,
                            border: '2px solid green',
                            pointerEvents: 'none',
                        }}
                    ></div>
                )}
            </div>
            <div className="mt-4">
                <h3 className="font-semibold">Drawn Shapes:</h3>
                <pre className="text-sm text-gray-700">
                    {JSON.stringify(shapes, null, 2)}
                </pre>
            </div>
        </div>
    )
}

export default ComicSplitter
