"use client"

import { useFieldViewport } from "@/hooks/use-field-viewport"

export function FieldView() {
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
    } = useFieldViewport()

    return (
        <div
            ref={fieldContainerRef}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={stopDragging}
            onMouseLeave={stopDragging}
            className={`flex flex-1 items-center justify-center overflow-hidden relative select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        >
            <img
                src="/unearthedWireframeField.png"
                alt="FLL Mat"
                style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transition: isDragging ? "none" : "transform 75ms ease-out",
                }}
                className="object-contain max-w-full max-h-full origin-center pointer-events-none"
            />
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
