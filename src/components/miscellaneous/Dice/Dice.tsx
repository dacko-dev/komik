'use client'

import React, { useState } from 'react'
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react'

/**
 * Dice component renders a 3D dice that rotates when clicked.
 * @param size - The size of the dice side in pixels
 */
export default function Dice({ size }: { size: number }) {
    const [rotation, setRotation] = useState({ x: 0, y: 0 })

    const rollDice = () => {
        // Generate a base final rotation that's a multiple of 90 degrees (for the final face)
        const finalXFace = 90 * Math.floor(Math.random() * 4)
        const finalYFace = 90 * Math.floor(Math.random() * 4)
        // Add several full rotations (360° multiples) for a rolling effect.
        const extraRotationsX = 360 * (Math.floor(Math.random() * 3) + 2) // 1-3 full rotations
        const extraRotationsY = 360 * (Math.floor(Math.random() * 3) + 2)
        // Calculate new rotation angles.
        const newX = finalXFace + extraRotationsX
        const newY = finalYFace + extraRotationsY

        setRotation({ x: newX, y: newY })
    }

    return (
        <div
            className="relative cursor-pointer"
            style={{
                width: `${size}px`,
                height: `${size}px`,
                perspective: '800px',
            }}
            onClick={rollDice}
        >
            <div
                className="w-full h-full relative transition-transform duration-1500 ease-out"
                style={{
                    transformStyle: 'preserve-3d',
                    transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                }}
            >
                {/* Front Face */}
                <Dice1
                    size={size}
                    className="absolute w-full h-full flex items-center justify-center"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: `rotateY(0deg) translateZ(${
                            size / 2 - 3
                        }px)`,
                    }}
                />
                {/* Back Face */}
                <Dice6
                    size={size}
                    className="absolute w-full h-full flex items-center justify-center"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: `rotateY(180deg) translateZ(${
                            size / 2 - 3
                        }px)`,
                    }}
                />
                {/* Right Face */}
                <Dice3
                    size={size}
                    className="absolute w-full h-full flex items-center justify-center"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: `rotateY(90deg) translateZ(${
                            size / 2 - 3
                        }px)`,
                    }}
                />
                {/* Left Face */}
                <Dice4
                    size={size}
                    className="absolute w-full h-full flex items-center justify-center"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: `rotateY(-90deg) translateZ(${
                            size / 2 - 3
                        }px)`,
                    }}
                />
                {/* Top Face */}
                <Dice2
                    size={size}
                    className="absolute w-full h-full flex items-center justify-center"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: `rotateX(90deg) translateZ(${
                            size / 2 - 3
                        }px)`,
                    }}
                />
                {/* Bottom Face */}
                <Dice5
                    size={size}
                    className="absolute w-full h-full flex items-center justify-center"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: `rotateX(-90deg) translateZ(${
                            size / 2 - 3
                        }px)`,
                    }}
                />
            </div>
        </div>
    )
}
