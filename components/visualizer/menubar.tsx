"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon, GripVerticalIcon, PlusIcon, XIcon, SplinePointerIcon, RobotArm, SettingsIcon } from "lucide-react"
import { ReactSortable } from "react-sortablejs"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Splan } from "./types"
import { Separator } from "../ui/separator"

const ICON_PROPS = { size: 18, strokeWidth: 2 }
type MenubarButtonProps = React.ComponentProps<typeof Button>

export function MenubarButton({ className, ...props }: MenubarButtonProps) {
    return (
        <Button
            className={cn("flex size-9 items-center justify-center rounded-lg bg-card border border-border text-foreground hover:bg-card/80 hover:border-primary", className)}
            {...props}
        />
    )
}

type MenubarProps = {
    splans: Splan[]
    selectedSplanId: string
    onSplanSelect: (id: string) => void
    onSplanReorder: (splans: Splan[]) => void
    onSplanDelete: (id: string) => void
    onSplanCreate: () => Splan | null
}

export function Menubar({ splans, selectedSplanId, onSplanSelect, onSplanReorder, onSplanDelete, onSplanCreate }: MenubarProps) {
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
        const newSplan = onSplanCreate()
        if (!newSplan) return
        window.setTimeout(() => {
            if (!trackRef.current) return
            trackRef.current.scrollLeft = trackRef.current.scrollWidth
            updateArrows()
        }, 10)
    }

    return (
        <div className="relative flex min-w-0 items-center gap-2 border-b px-2 py-3" ref={wrapRef}>
            <div className="flex shrink-0 items-center gap-2">
                <div onClick={() => window.location.assign("/")} className="flex cursor-pointer items-center gap-2">
                    <img src="/logo.svg" alt="PySplanner Logo" width={40} height={40} className="rounded-md" />
                    <span className="text-lg font-bold text-primary">PySplanner</span>
                </div>
                <Separator orientation="vertical" className="flex h-10 w-px mx-2" />
                <MenubarButton><SplinePointerIcon {...ICON_PROPS} /></MenubarButton>
                <MenubarButton><RobotArm {...ICON_PROPS} /></MenubarButton>
                <Separator orientation="vertical" className="flex h-10 w-px mx-2" />
            </div>

            <div className="relative min-w-0 flex-1">
                <div className={`pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-14 bg-linear-to-r from-background to-transparent transition-opacity duration-200 ${showLeft ? "opacity-100" : "opacity-0"}`}></div>
                <MenubarButton onClick={() => trackRef.current?.scrollBy({ left: -160, behavior: "smooth" })} className={`absolute left-0.5 top-1/2 z-20 -translate-y-1/2 active:-translate-y-1/2 bg-transparent text-primary hover:border-transparent hover:bg-transparent hover:cursor-pointer ${showLeft ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}>
                    <ChevronLeftIcon />
                </MenubarButton>

                <div className="scrollbar-hide flex overflow-x-auto scroll-smooth px-1" ref={trackRef} style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                    <ReactSortable tag="div" id="splans-list" list={splans} setList={onSplanReorder} animation={200} handle=".handle" className="flex flex-row items-center gap-2.5">
                        {splans.map((splan) => (
                            <div key={splan.id} onClick={() => onSplanSelect(splan.id)} className={`flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm font-medium whitespace-nowrap transition-colors ${selectedSplanId === splan.id ? "border-[#e8c547] text-[#e8c547]" : "border-[#333] bg-[#1c1c1c] text-[#eee]"}`}>
                                <GripVerticalIcon className="handle h-3.5 w-3.5 cursor-grab text-[#666] active:cursor-grabbing" />
                                <span>{splan.name}</span>
                                <XIcon onClick={(event) => { event.stopPropagation(); onSplanDelete(splan.id) }} className="h-3.5 w-3.5 cursor-pointer text-[#888] transition-colors hover:text-white" />
                            </div>
                        ))}
                    </ReactSortable>
                </div>

                <div className={`pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-14 bg-linear-to-l from-background to-transparent transition-opacity duration-200 ${showRight ? "opacity-100" : "opacity-0"}`}></div>
                <MenubarButton onClick={() => trackRef.current?.scrollBy({ left: 160, behavior: "smooth" })} className={`absolute right-0.5 top-1/2 z-20 -translate-y-1/2 active:-translate-y-1/2 hover:border-transparent bg-transparent text-primary hover:bg-transparent hover:cursor-pointer ${showRight ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}>
                    <ChevronRightIcon />
                </MenubarButton>
            </div>

            <MenubarButton onClick={createSplan} className="bg-primary hover:bg-primary/80"><PlusIcon {...ICON_PROPS} /></MenubarButton>
            <Separator orientation="vertical" className="flex h-10 w-px mx-2" />
            <MenubarButton><SettingsIcon {...ICON_PROPS} /></MenubarButton>
        </div>
    )
}