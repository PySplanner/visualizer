import { useState } from "react"
import { toast } from "sonner"
import type { ActionPoint, WayPoint, Splan } from "@/components/visualizer/types"

const MAX_SPLANS = 20

function createSplan(index: number): Splan {
    return {
        id: Date.now().toString(),
        name: `Splan ${index + 1}`,
        pathPoints: [],
        actionPoints: [],
    }
}

export function useSplans() {
    const [splans, setSplans] = useState<Splan[]>([
        { id: "0", name: "Splan 1", pathPoints: [], actionPoints: [] },
    ])
    const [selectedSplanId, setSelectedSplanId] = useState("0")

    const selectedSplan = splans.find((splan) => splan.id === selectedSplanId)

    const updateSelectedSplan = (update: (splan: Splan) => Splan) => {
        setSplans((currentSplans) => currentSplans.map((splan) => (
            splan.id === selectedSplanId ? update(splan) : splan
        )))
    }

    const setPathPoints = (pathPoints: WayPoint[]) => {
        if (selectedSplanId === "-1") return
        updateSelectedSplan((splan) => ({ ...splan, pathPoints }))
    }

    const setActionPoints = (actionPoints: ActionPoint[]) => {
        if (selectedSplanId === "-1") return
        updateSelectedSplan((splan) => ({ ...splan, actionPoints }))
    }

    const deleteSplan = (splanId: string) => {
        if (splans.length <= 1) {
            toast.error("Cannot delete the last splan.", {
                description: "To start fresh, create a new splan and delete the old one.",
            })
            return
        }

        setSplans((currentSplans) => currentSplans.filter((splan) => splan.id !== splanId))
        if (selectedSplanId === splanId) {
            const nextSplan = splans.find((splan) => splan.id !== splanId)
            setSelectedSplanId(nextSplan?.id ?? "-1")
        }
    }

    const addSplan = () => {
        if (splans.length >= MAX_SPLANS) {
            toast.error("Maximum number of splans reached (20).")
            return null
        }

        const newSplan = createSplan(splans.length)
        setSplans((currentSplans) => [...currentSplans, newSplan])
        setSelectedSplanId(newSplan.id)
        return newSplan
    }

    return {
        splans,
        setSplans,
        selectedSplan,
        selectedSplanId,
        setSelectedSplanId,
        setPathPoints,
        setActionPoints,
        addSplan,
        deleteSplan,
    }
}
