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
        label: "LINK/ETH",
        cacheKey: "link-eth",
        token1Address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
        token0Address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
    {
        label: "USDC/ETH",
        token0Address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
        token1Address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        cacheKey: "usdc-eth",
    },
    // Add more pairs as needed
]

const SushiswapTab = () => {
    const [selected, setSelected] = useState(PAIRS[0])
    console.log(selected, "selected")

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
                exchange="sushiswapv2"
            />
        </div>
    )
}

export default SushiswapTab
