// providers/uniswapV3Provider.ts

import { sepolia } from "viem/chains"
import { ethers } from "ethers"
import { BaseDexProvider, DexQuote } from "./baseDexProvider"

const UNISWAP_V2_CONFIG = {
    name: "Uniswap V2",
    factoryAddress: "0x0227628f3F023bb0B980b67D528571c95c6DaC1c", // Sepolia factory address
    poolAbi: ["function getPair(address tokenA, address tokenB) external view returns (address)"],
    pairAbi: [
        "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
        "function token0() view returns (address)",
        "function token1() view returns (address)",
    ],
}

export class UniswapV3Provider extends BaseDexProvider {
    factoryAddress: string
    constructor() {
        super(UNISWAP_V2_CONFIG)
        this.factoryAddress = UNISWAP_V2_CONFIG.factoryAddress
    }

    async getQuotes(
        pairSymbol: string,
        provider: ethers.Provider,
        chainId?: number
    ): Promise<DexQuote[]> {
        const currentPair = this.getCurrentPair(pairSymbol)
        console.log("currentPair", currentPair)
        this.factoryAddress = currentPair.address(chainId || sepolia.id)
        const { firstTokenAddress, secondTokenAddress } = currentPair

        if (!firstTokenAddress || !secondTokenAddress) {
            throw new Error(`Token addresses not found for pair ${pairSymbol}`)
        }

        const factory = new ethers.Contract(this.factoryAddress, this.config.poolAbi, provider)

        console.log("factory", factory)

        const pairAddress = await this.getPairAddress(
            factory,
            firstTokenAddress,
            secondTokenAddress
        )
        console.log("pairAddress", pairAddress)

        const pair = new ethers.Contract(pairAddress, this.config.pairAbi, provider)
        const { reserve0, reserve1 } = await this.getReserves(pair)

        const price = this.calculatePrice(reserve0, reserve1)
        const liquidity = this.calculateLiquidity(reserve0, reserve1)

        console.log("Price:", price)
        console.log("Liquidity:", liquidity)

        return [
            {
                dexName: this.config.name,
                price: price,
                liquidity: liquidity,
                spread: 0,
                arbOpportunity: 0,
                factoryAddress: this.factoryAddress,
            },
        ]
    }
}
