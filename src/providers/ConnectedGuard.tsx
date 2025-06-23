"use client"

import { useAccount } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import PleaseConnect from "@/components/PleaseConnect"

interface ConnectedGuardProps {
    children: React.ReactNode
}

export default function ConnectedGuard({ children }: ConnectedGuardProps) {
    const { isConnected } = useAccount()

    if (!isConnected) {
        return <PleaseConnect />
    }

    return <>{children}</>
}
