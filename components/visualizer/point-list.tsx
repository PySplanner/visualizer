"use client"

import { ArrowRightIcon, GripVerticalIcon } from "lucide-react"
import { ReactSortable } from "react-sortablejs"
import { Button } from "@/components/ui/button"
import type { ActionPoint, PathPoint } from "./types"

type PointListProps<T extends PathPoint | ActionPoint> = {
    id: string
    items: T[]
    setItems: (items: T[]) => void
    kind: "path" | "action"
    onSelect: (id: string) => void
    onHover: (id: string) => void
}

export function PointList<T extends PathPoint | ActionPoint>({
    id,
    items,
    setItems,
    kind,
    onSelect,
    onHover,
}: PointListProps<T>) {
    return (
        <ReactSortable tag="ul" id={id} list={items} setList={setItems} animation={200} handle=".handle">
            {items.map((point) => (
                <li key={point.id} className="flex flex-row items-center mb-2 last:mb-0">
                    <GripVerticalIcon className="handle mr-2 text-muted-foreground cursor-grab active:cursor-grabbing" />
                    <Button
                        variant="outline"
                        size="lg"
                        className="flex flex-1 justify-start hover:text-primary"
                        onClick={() => onSelect(point.id)}
                        onMouseEnter={() => onHover(point.id)}
                        onMouseLeave={() => onHover("-1")}
                    >
                        <span>{point.name}</span>
                        {kind === "path" ? (
                            <span className="ml-1 text-muted-foreground">
                                ({(point as PathPoint).x}, {(point as PathPoint).y}, {(point as PathPoint).heading})
                            </span>
                        ) : (
                            <span className="ml-1 text-muted-foreground">{(point as ActionPoint).t}</span>
                        )}
                        <ArrowRightIcon className="ml-auto" />
                    </Button>
                </li>
            ))}
        </ReactSortable>
    )
}
