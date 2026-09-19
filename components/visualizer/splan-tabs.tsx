"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon, GripVerticalIcon, PlusIcon, XIcon } from "lucide-react"
import { ReactSortable } from "react-sortablejs"
import type { Splan } from "./types"

type SplanTabsProps = {
    splans: Splan[]
    selectedSplanId: string
    onSelect: (id: string) => void
    onReorder: (splans: Splan[]) => void
    onDelete: (id: string) => void
    onCreate: () => Splan | null
}

export function SplanTabs({ splans, selectedSplanId, onSelect, onReorder, onDelete, onCreate }: SplanTabsProps) {
    const wrapRef = useRef<HTMLDivElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)
    const [showLeft, setShowLeft] = useState(false)
    const [showRight, setShowRight] = useState(false)

    const updateArrows = useCallback(() => {
        if (!trackRef.current) return
        const { scrollLeft, scrollWidth, clientWidth } = trackRef.current
        const maxScroll = scrollWidth - clientWidth
        const needsScroll = maxScroll > 2
        setShowLeft(needsScroll && scrollLeft > 2)
        setShowRight(needsScroll && scrollLeft < maxScroll - 2)
    }, [])

    useEffect(() => {
        const wrap = wrapRef.current
        const track = trackRef.current
        if (!wrap || !track) return

        const handleWheel = (event: WheelEvent) => {
            if (track.scrollWidth <= track.clientWidth) return
            event.preventDefault()
            track.scrollLeft += event.deltaY !== 0 ? event.deltaY : event.deltaX
            updateArrows()
        }

        wrap.addEventListener("wheel", handleWheel, { passive: false })
        track.addEventListener("scroll", updateArrows)
        window.addEventListener("resize", updateArrows)
        const timeoutId = window.setTimeout(updateArrows, 50)

        return () => {
            window.clearTimeout(timeoutId)
            wrap.removeEventListener("wheel", handleWheel)
            track.removeEventListener("scroll", updateArrows)
            window.removeEventListener("resize", updateArrows)
        }
    }, [splans.length, updateArrows])

    const createSplan = () => {
        const newSplan = onCreate()
        if (!newSplan) return
        window.setTimeout(() => {
            if (!trackRef.current) return
            trackRef.current.scrollLeft = trackRef.current.scrollWidth
            updateArrows()
        }, 10)
    }

    return (
        <div className="relative flex items-center px-2 py-3 border-b" ref={wrapRef}>
            <div className={`absolute left-0 top-0 bottom-0 w-14 bg-linear-to-r from-background to-transparent pointer-events-none z-10 transition-opacity duration-200 ${showLeft ? "opacity-100" : "opacity-0"}`}></div>
            <button onClick={() => trackRef.current?.scrollBy({ left: -160, behavior: "smooth" })} className={`absolute left-0.5 z-20 bg-transparent text-primary w-7 h-7 flex items-center justify-center transition-opacity duration-200 ${showLeft ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                <ChevronLeftIcon size={16} strokeWidth={2.5} />
            </button>

            <div className="flex gap-2.5 overflow-x-auto scroll-smooth flex-1 px-1 scrollbar-hide" ref={trackRef} style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                <ReactSortable tag="div" id="splans-list" list={splans} setList={onReorder} animation={200} handle=".handle" className="flex flex-row gap-2.5 items-center">
                    {splans.map((splan) => (
                        <div key={splan.id} onClick={() => onSelect(splan.id)} className={`flex items-center gap-2 shrink-0 bg-[#1c1c1c] border ${selectedSplanId === splan.id ? "border-[#e8c547] text-[#e8c547]" : "border-[#333] text-[#eee]"} rounded-lg px-3 h-9 text-sm font-medium whitespace-nowrap cursor-pointer transition-colors`}>
                            <GripVerticalIcon className="handle text-[#666] w-3.5 h-3.5 cursor-grab active:cursor-grabbing" />
                            <span>{splan.name}</span>
                            <XIcon onClick={(event) => { event.stopPropagation(); onDelete(splan.id) }} className="text-[#888] hover:text-white w-3.5 h-3.5 cursor-pointer transition-colors" />
                        </div>
                    ))}
                </ReactSortable>
            </div>

            <div className={`absolute right-10 top-0 bottom-0 w-14 bg-linear-to-l from-background to-transparent pointer-events-none z-10 transition-opacity duration-200 ${showRight ? "opacity-100" : "opacity-0"}`}></div>
            <button onClick={() => trackRef.current?.scrollBy({ left: 160, behavior: "smooth" })} className={`absolute right-10.5 z-20 bg-transparent text-primary w-7 h-7 flex items-center justify-center transition-opacity duration-200 ${showRight ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                <ChevronRightIcon size={16} strokeWidth={2.5} />
            </button>

            <button onClick={createSplan} className="relative z-20 shrink-0 w-9 h-9 rounded-lg text-black bg-primary hover:bg-primary/80 flex items-center justify-center ml-2 transition-colors">
                <PlusIcon size={18} strokeWidth={2.5} />
            </button>
        </div>
    )
}
