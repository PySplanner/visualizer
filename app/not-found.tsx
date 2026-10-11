"use client"

import { Button } from "@/components/ui/button"
import { ExternalLinkIcon } from "lucide-react"

export default function ScreenTooSmall() {
    return (
        <div className="flex flex-col h-full items-center justify-center p-6 text-center background-gradient">
            <img src="/logo.svg" alt="PySplanner Logo" className="rounded-md max-w-52 w-full" />
            <p className="mx-auto max-w-5xl text-lg md:text-xl text-muted-foreground my-6 leading-relaxed">
                The page you were looking for could not be found.
            </p>
            <Button size="lg" className="text-base w-full sm:w-auto px-4 transition-all" onClick={() => window.open("https://pysplanner.com/", '_blank')}>
                Go Home <ExternalLinkIcon className="ml-2 h-4 w-4" />
            </Button>
        </div>
    )
}