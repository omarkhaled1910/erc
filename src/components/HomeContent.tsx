"use client"

import { useState } from "react"
import AirdropForm from "@/components/AirdropForm"
import ConnectedGuard from "@/providers/ConnectedGuard"

export default function HomeContent() {
    const [isUnsafeMode, setIsUnsafeMode] = useState(false)

    return (
        <main>
            <ConnectedGuard>
                <div className="flex items-center justify-center p-4 md:p-6 xl:p-8">
                    <AirdropForm isUnsafeMode={isUnsafeMode} onModeChange={setIsUnsafeMode} />
                </div>
            </ConnectedGuard>
        </main>
    )
}
