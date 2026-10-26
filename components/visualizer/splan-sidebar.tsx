"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeIcon, WaypointsIcon } from "lucide-react"
import { PointList } from "./point-list"
import type { ActionPoint, WayPoint, Splan } from "../../types/geometry"

type SplanSidebarProps = {
    selectedSplan?: Splan
    selectedPathPointId: string
    selectedActionPointId: string
    setPathPoints: (points: WayPoint[]) => void
    setActionPoints: (points: ActionPoint[]) => void
    onSelectPoint: (id: string) => void
    onSelectAction: (id: string) => void
    onHoverPoint: (id: string) => void
    onHoverAction: (id: string) => void
}

export function SplanSidebar({
    selectedSplan,
    selectedPathPointId,
    selectedActionPointId,
    setPathPoints,
    setActionPoints,
    onSelectPoint,
    onSelectAction,
    onHoverPoint,
    onHoverAction,
}: SplanSidebarProps) {
    return (
        <Tabs defaultValue="points">
            <TabsList variant="line" className="w-full">
                <TabsTrigger value="points"><WaypointsIcon /> Splan Info</TabsTrigger>
                <TabsTrigger value="code"><CodeIcon /> Code</TabsTrigger>
            </TabsList>
            <TabsContent value="points">
                <Accordion type="multiple" className="px-4">
                    <AccordionItem value="points">
                        <AccordionTrigger>Points</AccordionTrigger>
                        <AccordionContent>
                            <PointList
                                id="points-list"
                                items={selectedSplan?.pathPoints ?? []}
                                kind="path"
                                selectedId={selectedPathPointId}
                                hoveredId={selectedActionPointId}
                                setItems={setPathPoints}
                                onSelect={onSelectPoint}
                                onHover={onHoverPoint}
                            />
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="actions">
                        <AccordionTrigger>Actions</AccordionTrigger>
                        <AccordionContent>
                            <PointList
                                id="actions-list"
                                items={selectedSplan?.actionPoints ?? []}
                                kind="action"
                                selectedId={selectedActionPointId}
                                hoveredId={selectedActionPointId}
                                setItems={setActionPoints}
                                onSelect={onSelectAction}
                                onHover={onHoverAction}
                            />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </TabsContent>
        </Tabs>
    )
}
