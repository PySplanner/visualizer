import { useCallback, useRef, useState } from "react"

type Pan = { x: number; y: number }

export function useFieldViewport() {
    const [zoom, setZoom] = useState(1)
    const [pan, setPan] = useState<Pan>({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const dragStartRef = useRef<Pan>({ x: 0, y: 0 })
    const fieldContainerRef = useRef<HTMLDivElement>(null)

    const clampPan = useCallback((newPan: Pan, currentZoom: number) => {
        if (!fieldContainerRef.current) return newPan

        const { clientWidth, clientHeight } = fieldContainerRef.current
        const maxPanX = Math.max(0, (clientWidth * (currentZoom - 1)) / 2) + (currentZoom > 1 ? 200 : 0)
        const maxPanY = Math.max(0, (clientHeight * (currentZoom - 1)) / 2) + (currentZoom > 1 ? 200 : 0)

        return {
            x: Math.min(Math.max(newPan.x, -maxPanX), maxPanX),
            y: Math.min(Math.max(newPan.y, -maxPanY), maxPanY),
        }
    }, [])

    const handleWheel = useCallback((event: React.WheelEvent<HTMLDivElement>) => {
        event.preventDefault()
        setZoom((previousZoom) => {
            const nextZoom = Math.min(Math.max(previousZoom - event.deltaY * 0.001, 0.5), 4)
            setPan((previousPan) => clampPan(previousPan, nextZoom))
            return nextZoom
        })
    }, [clampPan])

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.button !== 0) return
        setIsDragging(true)
        dragStartRef.current = {
            x: event.clientX - pan.x,
            y: event.clientY - pan.y,
        }
    }

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return
        setPan(clampPan({
            x: event.clientX - dragStartRef.current.x,
            y: event.clientY - dragStartRef.current.y,
        }, zoom))
    }

    const resetView = () => {
        setZoom(1)
        setPan({ x: 0, y: 0 })
    }

    return {
        zoom,
        pan,
        isDragging,
        fieldContainerRef,
        handleWheel,
        handleMouseDown,
        handleMouseMove,
        stopDragging: () => setIsDragging(false),
        resetView,
    }
}
