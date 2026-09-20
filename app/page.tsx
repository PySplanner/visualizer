"use client"

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { useState } from "react"
import { useSplans } from "@/hooks/use-splans"
import { FieldView } from "@/components/visualizer/field-view"
import { SplanSidebar } from "@/components/visualizer/splan-sidebar"
import { Menubar } from "@/components/visualizer/menubar"

export default function Visualizer() {
    const {
        splans,
        setSplans,
        selectedSplan,
        selectedSplanId,
        setSelectedSplanId,
        setPathPoints,
        setActionPoints,
        addSplan,
        deleteSplan,
    } = useSplans()
    const [selectedPointId, setSelectedPointId] = useState("-1")
    const [selectedActionId, setSelectedActionId] = useState("-1")
    const [hoveredPointId, setHoveredPointId] = useState("-1")
    const [hoveredActionId, setHoveredActionId] = useState("-1")

    return (
        <div className="flex flex-col h-full w-full overflow-hidden">
            <Menubar
                splans={splans}
                selectedSplanId={selectedSplanId}
                onSelect={setSelectedSplanId}
                onReorder={setSplans}
                onDelete={deleteSplan}
                onCreate={addSplan}
            />
            <ResizablePanelGroup orientation="horizontal">
                <ResizablePanel defaultSize="400px" minSize="300px" maxSize="600px" collapsible>
                    <SplanSidebar
                        selectedSplan={selectedSplan}
                        setPathPoints={setPathPoints}
                        setActionPoints={setActionPoints}
                        onSelectPoint={setSelectedPointId}
                        onSelectAction={setSelectedActionId}
                        onHoverPoint={setHoveredPointId}
                        onHoverAction={setHoveredActionId}
                    />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel className="flex overflow-hidden">
                    <FieldView />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}
