"use client"

import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { http } from "viem"
import {
    arbitrum,
    base,
    mainnet,
    optimism,
    anvil,
    zksync,
    sepolia,
    goChain,
    localhost,
    Chain,
} from "wagmi/chains"

export const ganache = {
    id: 1337, // Common Ganache Chain ID, check your Ganache UI
    name: "Ganache",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: {
        default: { http: ["http://127.0.0.1:8545"] }, // Your Ganache RPC URL
    },
    blockExplorers: {
        default: { name: "Ganache", url: "http://127.0.0.1:8545" }, // Or any local block explorer if you have one
    },
    // Optional: Add contracts specific to Ganache if you have them for display
    contracts: {},
} as const satisfies Chain
export default getDefaultConfig({
    appName: "TSender",
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    chains: [
        mainnet,
        optimism,
        arbitrum,
        base,
        zksync,
        sepolia,
        anvil,
        goChain,
        // localhost,
        ganache,
    ],
    // transports: [http()],
    ssr: false,
})
