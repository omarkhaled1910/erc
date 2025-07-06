"use client"
import dynamic from "next/dynamic"

const InteractionWrapper = dynamic(() => import("./InteractionWrapper"), {
    ssr: false,
})

export default function InteractPage() {
    return (
        <div className="container mx-auto py-8">
            <InteractionWrapper />
        </div>
    )
}
