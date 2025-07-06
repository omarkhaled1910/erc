"use client"
import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { TOKEN_PAIRS } from "@/constants"
import { Input } from "@/components/ui/input"

const BotPage = () => {
    const [isBotActive, setIsBotActive] = useState(false)
    const [flashbotsEnabled, setFlashbotsEnabled] = useState(true)
    const [minProfitThreshold, setMinProfitThreshold] = useState(0.05)
    const [selectedPairs, setSelectedPairs] = useState<string[]>([])
    const [gasPrice, setGasPrice] = useState(45)

    const togglePairSelection = (pair: string) => {
        setSelectedPairs(prev =>
            prev.includes(pair) ? prev.filter(p => p !== pair) : [...prev, pair]
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Arbitrage Bot Controller
                </h1>
                <div className="flex items-center space-x-4">
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                            isBotActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                    >
                        {isBotActive ? "RUNNING" : "STOPPED"}
                    </span>
                    <Button
                        size="lg"
                        onClick={() => setIsBotActive(!isBotActive)}
                        className={
                            isBotActive
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-green-600 hover:bg-green-700"
                        }
                    >
                        {isBotActive ? "Stop Bot" : "Start Bot"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Bot Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="min-profit">Min Profit Threshold (ETH)</Label>
                                <Input
                                    id="min-profit"
                                    type="number"
                                    value={minProfitThreshold}
                                    onChange={e =>
                                        setMinProfitThreshold(parseFloat(e.target.value))
                                    }
                                    step="0.01"
                                />
                                <Slider
                                    defaultValue={[minProfitThreshold]}
                                    max={0.5}
                                    step={0.01}
                                    onValueChange={val => setMinProfitThreshold(val[0])}
                                    className="mt-4"
                                />
                            </div>

                            <div>
                                <Label htmlFor="gas-price">Max Gas Price (Gwei)</Label>
                                <Input
                                    id="gas-price"
                                    type="number"
                                    value={gasPrice}
                                    onChange={e => setGasPrice(parseInt(e.target.value))}
                                />
                                <Slider
                                    defaultValue={[gasPrice]}
                                    max={200}
                                    step={1}
                                    onValueChange={val => setGasPrice(val[0])}
                                    className="mt-4"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="flashbots"
                                    checked={flashbotsEnabled}
                                    onCheckedChange={setFlashbotsEnabled}
                                />
                                <Label htmlFor="flashbots">Flashbots (MEV Protection)</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Switch id="auto-gas" defaultChecked />
                                <Label htmlFor="auto-gas">Auto Gas Optimization</Label>
                            </div>
                        </div>

                        <div>
                            <Label>Token Pairs</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {TOKEN_PAIRS.map(pair => (
                                    <Badge
                                        key={pair.symbol}
                                        variant={
                                            selectedPairs.includes(pair.symbol)
                                                ? "default"
                                                : "outline"
                                        }
                                        className="cursor-pointer px-4 py-1.5 text-sm"
                                        onClick={() => togglePairSelection(pair.symbol)}
                                    >
                                        {pair.symbol}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant="outline" className="w-full justify-start">
                            Execute Single Trade
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                            Simulate Opportunity
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                            Withdraw Profits
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                            View Contract
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Recent Trades</CardTitle>
                            <Button variant="outline" size="sm">
                                View All
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex justify-between items-center border-b pb-3"
                                >
                                    <div>
                                        <p className="font-medium">ETH/USDC</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            2 mins ago · Uniswap → Sushiswap
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-green-500">+0.042 ETH</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            $158.42
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Transaction Log</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-gray-900 text-green-400 font-mono text-sm rounded-lg p-4 h-64 overflow-y-auto">
                            <div>[2023-11-15 14:23:45] Bot started</div>
                            <div>[2023-11-15 14:24:12] Opportunity found: ETH/USDC</div>
                            <div className="text-blue-400">
                                [2023-11-15 14:24:13] Executing trade via Flashbots
                            </div>
                            <div>
                                [2023-11-15 14:24:15] Trade successful! Profit: 0.0231 ETH ($86.45)
                            </div>
                            <div>[2023-11-15 14:26:31] Opportunity found: WBTC/ETH</div>
                            <div className="text-blue-400">
                                [2023-11-15 14:26:32] Executing trade via Flashbots
                            </div>
                            <div>
                                [2023-11-15 14:26:35] Trade successful! Profit: 0.0178 ETH ($66.12)
                            </div>
                            <div>
                                [2023-11-15 14:28:47] Gas price exceeds threshold (52 gwei).
                                Skipping trade.
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex space-x-2">
                        <Input placeholder="Filter logs..." />
                        <Button variant="secondary">Clear Logs</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default BotPage
