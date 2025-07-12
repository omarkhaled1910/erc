"use client"

import { useDexQuotes } from "@/hooks/useDexQuotes"
import { PublicClient } from "viem"
import DexTable from "./DexTable"

export function LiquidityPoolTab({
    pairSymbol,
    publicClient,
}: {
    pairSymbol: string
    publicClient: PublicClient
}) {
    const { data: quotes, isLoading, error } = useDexQuotes(pairSymbol, publicClient)

    if (isLoading) return <p>Loading prices...</p>
    if (error) return <p>Error loading prices: {error.message}</p>
    if (!quotes || quotes.length === 0) return <p>No quotes available.</p>

    return <DexTable dexData={quotes} />
}
