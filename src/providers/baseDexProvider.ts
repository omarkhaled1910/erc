// providers/baseDexProvider.ts

import { TOKEN_PAIRS } from "@/constants"
import { fromDecimals } from "@/utils"
import { ethers } from "ethers"
import JSBI from "jsbi"

export interface DexQuote {
    dexName: string
    price: number
    liquidity?: number
    spread?: number // in %
    arbOpportunity?: number // in %
    factoryAddress: string
}

export interface DexConfig {
    name: string
    factoryAddress: string
    poolAbi: string[]
    pairAbi: string[]
}

export abstract class BaseDexProvider {
    protected config: DexConfig
    factoryAddress: string = ""

    constructor(config: DexConfig) {
        this.config = config
    }

    protected getCurrentPair(pairSymbol: string) {
        const currentPair = TOKEN_PAIRS.find(pair => pair.symbol === pairSymbol)
        if (!currentPair) {
            throw new Error(`Pair ${pairSymbol} not found`)
        }
        console.log("currentPair", currentPair)
        return currentPair
    }

    protected async getPairAddress(
        factory: ethers.Contract,
        tokenA: string,
        tokenB: string
    ): Promise<string> {
        console.log("factory", factory)
        console.log("tokenA", tokenA)
        console.log("tokenB", tokenB)
        return await factory.getPair(tokenA, tokenB)
    }

    protected async getReserves(pair: ethers.Contract) {
        const [reserve0, reserve1, timestamp] = await pair.getReserves()
        return { reserve0, reserve1, timestamp }
    }

    protected calculatePrice(
        reserve0: ethers.BigNumberish,
        reserve1: ethers.BigNumberish
    ): number {
        const reserve0Formatted = JSBI.BigInt(reserve0.toString())
        const reserve1Formatted = JSBI.BigInt(reserve1.toString())
        const precision = JSBI.BigInt(10 ** 18)

        const priceJSBI = JSBI.divide(
            JSBI.multiply(reserve0Formatted, precision),
            reserve1Formatted
        )

        return Number(priceJSBI.toString()) / 1e18
    }

    protected calculateLiquidity(
        reserve0: ethers.BigNumberish,
        reserve1: ethers.BigNumberish
    ): number {
        const reserve0Formatted = JSBI.BigInt(reserve0.toString())
        const reserve1Formatted = JSBI.BigInt(reserve1.toString())

        return Number(reserve0Formatted.toString()) + Number(reserve1Formatted.toString())
    }

    abstract getQuotes(pairSymbol: string, provider: ethers.Provider): Promise<DexQuote[]>
}
