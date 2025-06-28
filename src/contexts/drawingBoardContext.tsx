import React, { createContext, useContext, useState } from 'react'

export enum DrawAction {
    SELECT = 'select',
    MOVE = 'move',
    ERASER = 'eraser',
    PENCIL = 'pencil',
    EYEDROPPER = 'eyedropper',
    PAINTBRUSH = 'paintbrush',
    PAINT_BUCKET = 'paint-bucket',
    RECTANGLE = 'rectangle',
    CIRCLE = 'circle',
    HEXAGON = 'hexagon',
    LINE = 'line',
    HEART = 'heart',
    STAR = 'star',
    TEXT = 'text',
    SQUARE_CHAT_BUBBLE = 'square-bubble',
    CIRCLE_CHAT_BUBBLE = 'circle-bubble',
}

export enum TabType {
    LAYERS = 'layer',
    STICKERS = 'stickers',
}
