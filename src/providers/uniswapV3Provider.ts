// providers/uniswapV3Provider.ts

import { TOKEN_PAIRS } from "@/constants"
import { ethers } from "ethers"
import JSBI from "jsbi"

export interface DexQuote {
    dexName: string
    price: number
    liquidity?: number
    spread?: number // in %
    arbOpportunity?: number // in %
}

const POOL_ABI = [
    "function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)",
    "function liquidity() view returns (uint128)",
]
export interface DexPriceProvider {
    getQuotes(pairSymbol: string, provider: ethers.Provider): Promise<DexQuote[]>
}
export class UniswapV3Provider implements DexPriceProvider {
    async getQuotes(pairSymbol: string, provider: ethers.Provider): Promise<DexQuote[]> {
        const currrentPair = TOKEN_PAIRS.find(pair => pair.symbol === pairSymbol)
        if (!currrentPair) {
            throw new Error(`Pair ${pairSymbol} not found`)
        }
        const { address, symbol } = currrentPair
        const [firstTokenSymbol, secTokenSymbol] = symbol.split("/")

        const poolContract = new ethers.Contract(address(), POOL_ABI, provider)

        // const [sqrtPriceX96, tick, liquidity] = await poolContract.slot0()

        console.log("poolContract", poolContract)

        const [slot0, liquidity] = await Promise.all([
            poolContract.slot0(),
            poolContract.liquidity(),
        ])

        const sqrtPriceX96JSBI = JSBI.BigInt(slot0[0])
        const liquidityJSBI = JSBI.BigInt(liquidity)
        console.log("slot0", { slot0, sqrtPriceX96JSBI })
        console.log("liquidity", { liquidity, liquidityJSBI })

        return [
            {
                dexName: "Uniswap V3",
                price: 18541.32,
                liquidity: 3500000,
                spread: 0,
                arbOpportunity: 0,
            },
        ]
    }
}
