"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useField } from "@/hooks/use-field"
import { useSettings } from "@/hooks/use-settings"
import type { WayPoint } from "@/types/geometry"

type FieldViewProps = {
    isCreatingPoint: boolean
    pathPoints: WayPoint[]
    setPathPoints: (points: WayPoint[]) => void
    onPointCreationComplete: () => void
}

type ImageRect = {
    left: number
    top: number
    width: number
    height: number
}

export function FieldView({ isCreatingPoint, pathPoints, setPathPoints, onPointCreationComplete }: FieldViewProps) {
    const { settings } = useSettings()
    const {
        zoom,
        pan,
        isDragging,
        fieldContainerRef,
        handleWheel,
        handleMouseDown,
        handleMouseMove,
        stopDragging,
        resetView,
    } = useField()
    const imageRef = useRef<HTMLImageElement>(null)
    const pointerStartRef = useRef<{ x: number; y: number } | null>(null)
    const didDragRef = useRef(false)
    const [imageRect, setImageRect] = useState<ImageRect | null>(null)
    const [previewPoint, setPreviewPoint] = useState<{ x: number; y: number } | null>(null)

    const updateImageRect = useCallback(() => {
        const image = imageRef.current
        const container = fieldContainerRef.current
        if (!image || !container) return
        const rect = image.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        setImageRect({
            left: rect.left - containerRect.left,
            top: rect.top - containerRect.top,
            width: rect.width,
            height: rect.height,
        })
    }, [fieldContainerRef])

    useEffect(() => {
        const image = imageRef.current
        if (!image) return

        const observer = new ResizeObserver(updateImageRect)
        observer.observe(image)
        window.addEventListener("resize", updateImageRect)
        updateImageRect()
        return () => {
            observer.disconnect()
            window.removeEventListener("resize", updateImageRect)
        }
    }, [updateImageRect])

    useEffect(() => {
        let frameCount = 0
        let frameId = 0

        const updateDuringTransform = () => {
            updateImageRect()
            if (frameCount < 8) {
                frameCount += 1
                frameId = window.requestAnimationFrame(updateDuringTransform)
            }
        }

        frameId = window.requestAnimationFrame(updateDuringTransform)
        return () => window.cancelAnimationFrame(frameId)
    }, [pan, zoom, updateImageRect])

    const getPointFromEvent = (event: React.MouseEvent<HTMLDivElement>) => {
        const image = imageRef.current
        if (!image) return null

        const rect = image.getBoundingClientRect()
        if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
        ) {
            return null
        }

        return {
            x: ((event.clientX - rect.left) / rect.width) * settings.fieldWidthInches,
            y: ((event.clientY - rect.top) / rect.height) * settings.fieldLengthInches,
        }
    }

    const handlePointMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        handleMouseMove(event)
        if (pointerStartRef.current) {
            const movedX = event.clientX - pointerStartRef.current.x
            const movedY = event.clientY - pointerStartRef.current.y
            if (Math.hypot(movedX, movedY) > 3) didDragRef.current = true
        }
        if (isCreatingPoint) setPreviewPoint(getPointFromEvent(event))
    }

    const handlePointClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!isCreatingPoint || didDragRef.current) return
        const point = getPointFromEvent(event)
        if (point) {
            setPathPoints([
                ...pathPoints,
                {
                    id: crypto.randomUUID(),
                    name: `Point ${pathPoints.length + 1}`,
                    x: Number(point.x.toFixed(2)),
                    y: Number(point.y.toFixed(2)),
                    theta: 0,
                    magnitude: 0,
                },
            ])
        }
        setPreviewPoint(null)
        onPointCreationComplete()
    }

    const pointStyle = (point: { x: number; y: number }) => {
        if (!imageRect) return undefined
        return {
            left: imageRect.left + (point.x / settings.fieldWidthInches) * imageRect.width,
            top: imageRect.top + (point.y / settings.fieldLengthInches) * imageRect.height,
        }
    }

    return (
        <div
            ref={fieldContainerRef}
            onWheel={handleWheel}
            onMouseDown={(event) => {
                pointerStartRef.current = { x: event.clientX, y: event.clientY }
                didDragRef.current = false
                handleMouseDown(event)
            }}
            onMouseMove={handlePointMouseMove}
            onMouseUp={stopDragging}
            onMouseLeave={() => {
                stopDragging()
                setPreviewPoint(null)
            }}
            onClick={handlePointClick}
            className={`flex flex-1 items-center justify-center overflow-hidden relative select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        >
            <img
                ref={imageRef}
                onLoad={updateImageRect}
                src={`/fields/${settings.fieldImage}.png`}
                alt="FLL Mat"
                style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transition: isDragging ? "none" : "transform 75ms ease-out",
                }}
                className="object-contain max-w-full max-h-full origin-center pointer-events-none"
            />
            {imageRect && pathPoints.map((point) => (
                <span
                    key={point.id}
                    className="pointer-events-none absolute z-20 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
                    style={pointStyle(point)}
                    title={point.name}
                />
            ))}
            {isCreatingPoint && previewPoint && (
                <span
                    className="pointer-events-none absolute z-20 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/60"
                    style={pointStyle(previewPoint)}
                />
            )}
            {(zoom !== 1 || pan.x !== 0 || pan.y !== 0) && (
                <button
                    onClick={resetView}
                    className="absolute bottom-4 right-4 z-10 bg-background/80 hover:bg-background text-xs px-2.5 py-1.5 rounded border shadow transition-colors cursor-pointer"
                >
                    Reset View ({Math.round(zoom * 100)}%)
                </button>
            )}
        </div>
    )
}
