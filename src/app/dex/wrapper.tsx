"use client"

import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import DexTable from "./DexTable"
import ProfitChart from "./ProfitChart"
import { TOKEN_PAIRS } from "@/constants"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useDexQuotes } from "@/hooks/useDexQuotes"
import { createPublicClient, http, PublicClient } from "viem"
import { sepolia } from "viem/chains"

const DexWrapper = ({ publicClient2 }: { publicClient2?: PublicClient }) => {
    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || "", {
            timeout: 60_000, // 30 seconds
        }),
    })
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Cross-DEX Arbitrage Dashboard
                </h1>
                <div className="flex space-x-4">
                    <div>
                        <Label htmlFor="time-range" className="block text-sm font-medium mb-1">
                            Time Range
                        </Label>
                        <Select defaultValue="24h">
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Select range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1h">1H</SelectItem>
                                <SelectItem value="24h">24H</SelectItem>
                                <SelectItem value="7d">7D</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">3.28 ETH</p>
                        <p className="text-indigo-200 text-sm mt-1">≈ $12,450</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">24h Trades</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">42</p>
                        <p className="text-green-500 text-sm mt-1">+12% from yesterday</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">92.4%</p>
                        <p className="text-green-500 text-sm mt-1">3 failed / 42 attempts</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium">Gas Used</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">1.7 ETH</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                            Avg 0.04 ETH/trade
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Profit Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ProfitChart />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top Performing Pairs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {TOKEN_PAIRS.map((pair, index) => (
                                <div
                                    key={pair.symbol}
                                    className="flex justify-between items-center"
                                >
                                    <div className="flex items-center">
                                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                                        <div className="ml-4">
                                            <p className="font-medium">{pair.symbol}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                ${(12450 / TOKEN_PAIRS.length).toFixed(2)} profit
                                            </p>
                                        </div>
                                    </div>
                                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                        +{(18.5 - index * 3.2).toFixed(1)}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>DEX Price Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="eth-usdc">
                        <TabsList className="grid w-full grid-cols-3">
                            {TOKEN_PAIRS.map(pair => (
                                <TabsTrigger
                                    key={pair.symbol}
                                    value={pair.symbol.toLowerCase().replace("/", "-")}
                                >
                                    {pair.symbol}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        {TOKEN_PAIRS.map(pair => (
                            <TabsContent
                                key={pair.symbol}
                                value={pair.symbol.toLowerCase().replace("/", "-")}
                            >
                                {/* <DexTable pair={pair.symbol} /> */}
                                <LiquidityPoolTab
                                    pairSymbol={pair.symbol}
                                    publicClient={publicClient}
                                />
                            </TabsContent>
                        ))}
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}

export default DexWrapper

function LiquidityPoolTab({
    pairSymbol,
    publicClient,
}: {
    pairSymbol: string
    publicClient: PublicClient
}) {
    const { data: quotes, isLoading, error } = useDexQuotes(pairSymbol, publicClient)

    if (isLoading) return <p>Loading prices...</p>
    if (error || !quotes) return <p>Error loading prices: {error?.message}</p>

    return <DexTable quotes={quotes} />
}
