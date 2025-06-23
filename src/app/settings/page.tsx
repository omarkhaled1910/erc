"use client"

import SettingsWrapper from "./SettingsWrapper"
import { Settings2 } from "lucide-react"

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Settings2 className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-semibold">Settings</h1>
            </div>
            <div className="bg-white rounded-lg shadow">
                <SettingsWrapper />
            </div>
        </div>
    )
}
