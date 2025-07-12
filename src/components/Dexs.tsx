import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import SushiswapTab from "./SushiswapTab"
import UniswapTab from "./UniswapTab"

const DEX_TABS = [
    {
        value: "sushiswap",
        label: "Sushiswap",
        Component: SushiswapTab,
    },
    {
        value: "uniswap",
        label: "Uniswap",
        Component: UniswapTab,
    },
    // Add more DEXs here as needed
]

const Dexs = () => {
    return (
        <div>
            <Tabs defaultValue={DEX_TABS[0].value}>
                <TabsList className="w-full">
                    {DEX_TABS.map(({ value, label }) => (
                        <TabsTrigger key={value} value={value}>
                            {label}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {DEX_TABS.map(({ value, Component }) => (
                    <TabsContent key={value} value={value}>
                        <Component />
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}

export default Dexs
