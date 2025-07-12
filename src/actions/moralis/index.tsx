// Solution 1: Initialize Moralis only once with a flag
"use server"
import { EvmChain } from "@moralisweb3/common-evm-utils"
import Moralis from "moralis"

// Global flag to track if Moralis has been initialized
let isMoralisInitialized = false

async function initializeMoralis() {
    if (!isMoralisInitialized) {
        await Moralis.start({
            apiKey: process.env.NEXT_PRIVATE_MORALIS,
            // ...and any other configuration
        })
        isMoralisInitialized = true
    }
}

export async function getPairData(
    token0Address = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    token1Address = "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    chainId = EvmChain.ETHEREUM,
    exchange = "sushiswapv2" as any
): Promise<any> {
    // Initialize Moralis only if not already initialized
    await initializeMoralis()

    const chain = chainId || EvmChain.ETHEREUM

    // token 0 address, e.g. WETH token address

    const response = await Moralis.EvmApi.defi.getPairAddress({
        token0Address,
        token1Address,
        chain,
        exchange: exchange,
    })

    console.log(response, "response")
    return response.result
}

// Solution 2: Alternative approach - Check if Moralis is already started
export async function getPairDataAlternative(tokenAddress: string, chainId: number) {
    try {
        // Try to start Moralis, but catch the error if already started
        await Moralis.start({
            apiKey: process.env.NEXT_PRIVATE_MORALIS,
        })
    } catch (error: any) {
        // If the error is about modules already started, ignore it
        if (error.code !== "C0009") {
            throw error // Re-throw if it's a different error
        }
    }

    const chain = EvmChain.SEPOLIA

    const token0Address = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    const token1Address = "0x514910771AF9Ca656af840dff83E8264EcF986CA"

    const response = await Moralis.EvmApi.defi.getPairAddress({
        token0Address,
        token1Address,
        chain,
        exchange: "sushiswapv2",
    })

    console.log(response.toJSON())
    return response
}

// Solution 3: Best Practice - Initialize in a separate module
// Create a file: lib/moralis.ts
export async function initMoralis() {
    if (!Moralis.Core.isStarted) {
        await Moralis.start({
            apiKey: process.env.NEXT_PRIVATE_MORALIS,
        })
    }
}

// Then in your function:
export async function getPairDataBestPractice(tokenAddress: string, chainId: number) {
    await initMoralis()

    const chain = EvmChain.SEPOLIA

    const token0Address = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    const token1Address = "0x514910771AF9Ca656af840dff83E8264EcF986CA"

    const response = await Moralis.EvmApi.defi.getPairAddress({
        token0Address,
        token1Address,
        chain,
        exchange: "sushiswapv2",
    })

    console.log(response.toJSON())
    return response
}
