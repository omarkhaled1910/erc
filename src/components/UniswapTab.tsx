import React, { useState } from "react"
import { EvmChain } from "@moralisweb3/common-evm-utils"
import MoralisPairCard from "./MoralisPairCard"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"

const PAIRS = [
    {
        label: "HEX/USDT",
        token0Address: "0x2b591e99afe9f32eaa6214f7b7629768c40eeb39",
        token1Address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
        cacheKey: "uniswap-hex-usdt",
    },
    {
        label: "USDC/ETH",
        token0Address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
        token1Address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        cacheKey: "uniswap-usdc-eth",
    },
    // Add more pairs as needed
]

const UniswapTab = () => {
    const [selected, setSelected] = useState(PAIRS[0])

    return (
        <div className="space-y-4">
            <Select
                value={selected.cacheKey}
                onValueChange={val => {
                    const found = PAIRS.find(p => p.cacheKey === val)
                    if (found) setSelected(found)
                }}
            >
                <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Select pair" />
                </SelectTrigger>
                <SelectContent>
                    {PAIRS.map(pair => (
                        <SelectItem key={pair.cacheKey} value={pair.cacheKey}>
                            {pair.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <MoralisPairCard
                token0Address={selected.token0Address}
                token1Address={selected.token1Address}
                chainId={EvmChain.ETHEREUM}
                cacheKey={selected.cacheKey}
                exchange="uniswapv2"
            />
        </div>
    )
}

export default UniswapTab
