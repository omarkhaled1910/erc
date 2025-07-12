// providers/sushiSwapProvider.ts

import { ethers } from "ethers"
import { BaseDexProvider, DexQuote } from "./baseDexProvider"
import { sepolia } from "viem/chains"

const SUSHISWAP_CONFIG = {
    name: "Sushiswap",
    factoryAddress: "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac", // SushiSwap V2 factory on Sepolia
    poolAbi: ["function getPair(address tokenA, address tokenB) external view returns (address)"],
    pairAbi: [
        "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
        "function token0() view returns (address)",
        "function token1() view returns (address)",
    ],
}

export class SushiSwapProvider extends BaseDexProvider {
    constructor() {
        super(SUSHISWAP_CONFIG)
    }

    async getQuotes(
        pairSymbol: string,
        provider: ethers.Provider,
        chainId?: number
    ): Promise<DexQuote[]> {
        const currentPair = this.getCurrentPair(pairSymbol)
        this.factoryAddress = currentPair.address(chainId || sepolia.id)

        const { firstTokenAddress, secondTokenAddress } = currentPair

        if (!firstTokenAddress || !secondTokenAddress) {
            throw new Error(`Token addresses not found for pair ${pairSymbol}`)
        }

        const factory = new ethers.Contract(this.factoryAddress, this.config.poolAbi, provider)

        console.log("factory", factory)

        // const pairAddress = await this.getPairAddress(
        //     factory,
        //     firstTokenAddress,
        //     secondTokenAddress
        // )
        // console.log("SushiSwap pairAddress", pairAddress)

        // // Check if pair exists (SushiSwap might not have all pairs)
        // if (pairAddress === "0x0000000000000000000000000000000000000000") {
        //     console.log(`No SushiSwap pair found for ${pairSymbol}`)
        //     return []
        // }

        // const pair = new ethers.Contract(pairAddress, this.config.pairAbi, provider)
        // const { reserve0, reserve1 } = await this.getReserves(pair)

        // const price = this.calculatePrice(reserve0, reserve1)
        // const liquidity = this.calculateLiquidity(reserve0, reserve1)

        // console.log("SushiSwap Price:", price)
        // console.log("SushiSwap Liquidity:", liquidity)

        return [
            {
                dexName: this.config.name,
                price: 0,
                liquidity: 0,
                spread: 0,
                arbOpportunity: 0,
                factoryAddress: this.config.factoryAddress,
            },
        ]
    }
}
