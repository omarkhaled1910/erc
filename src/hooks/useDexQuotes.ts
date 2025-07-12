import { useQuery } from "@tanstack/react-query"
import { UniswapV3Provider } from "@/providers/uniswapV3Provider"
import { usePublicClient } from "wagmi"
import { ethers } from "ethers"
import { createPublicClient, http, PublicClient } from "viem"
import { sepolia } from "viem/chains"
import { BaseDexProvider, DexQuote } from "@/providers/baseDexProvider"
import { SushiSwapProvider } from "@/providers/sushiSwapProvider"

// Your providers array (make sure it's imported or declared in this file)
const providers: BaseDexProvider[] = [new UniswapV3Provider(), new SushiSwapProvider()]

export function useDexQuotes(pairSymbol: string, publicClient: PublicClient) {
    // Convert Viem PublicClient to Ethers.js provider
    const provider = new ethers.BrowserProvider(publicClient?.transport)
    const { data, isLoading, error } = useQuery<DexQuote[], Error>({
        queryKey: ["dexQuotes", pairSymbol],
        queryFn: async () => {
            const results = await Promise.all(
                providers.map(p => p.getQuotes(pairSymbol, provider))
            )
            return results.flat()
        },
        staleTime: 30 * 1000, // 30 seconds
        refetchInterval: 30 * 1000, // refetch every 30 seconds (optional)
        retry: 1, // retry once on failure
    })

    return { data, isLoading, error }
}
