// app/lib/blockchain/getSepoliaClients.ts
"use server"

import { createPublicClient, createWalletClient, http, custom } from "viem"
import { sepolia } from "wagmi/chains"
import { privateKeyToAccount } from "viem/accounts"

export async function getSepoliaClients() {
    const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
    const PRIVATE_KEY = process.env.PRIVATE_KEY

    if (!SEPOLIA_RPC_URL || !PRIVATE_KEY) {
        throw new Error("Missing SEPOLIA_RPC_URL or PRIVATE_KEY in environment")
    }

    const deployerAccount = privateKeyToAccount(PRIVATE_KEY as `0x${string}`)

    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(SEPOLIA_RPC_URL),
    })

    const walletClient = createWalletClient({
        account: deployerAccount,
        chain: sepolia,
        transport: custom({
            async request({ method, params }) {
                const res = await fetch(SEPOLIA_RPC_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
                })
                const json = await res.json()
                if (json.error) throw new Error(json.error.message)
                return json.result
            },
        }),
    })

    return {
        publicClient,
        walletClient,
        deployerAccount,
    }
}
