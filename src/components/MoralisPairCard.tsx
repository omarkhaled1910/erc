import React from "react"
import { useQuery } from "@tanstack/react-query"
import { getPairData } from "@/actions/moralis"
import { GetPairAddressResponseAdapter } from "@moralisweb3/common-evm-utils"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { EvmChain } from "@moralisweb3/common-evm-utils"

const MoralisPairCard = ({
    token0Address = "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    token1Address = "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    chainId = EvmChain.ETHEREUM,
    cacheKey,
    exchange = "",
}: {
    token0Address?: string
    token1Address?: string
    chainId?: EvmChain
    cacheKey: string
    exchange?: string
}) => {
    const { data, isLoading, error } = useQuery<any, Error>({
        queryKey: [cacheKey, token0Address, token1Address],
        queryFn: async () => {
            const response = await getPairData(token0Address, token1Address, chainId, exchange)
            return response
        },
        staleTime: 30 * 1000,
        refetchInterval: 30 * 1000,
        retry: 1,
    })

    // Extract relevant data
    const token0 = data?.token0?.token
    const token1 = data?.token1?.token

    console.log(data, "data from moralis", token0Address)

    return (
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 shadow-lg">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            {cacheKey} Pair
                            <Badge variant="secondary" className="text-sm font-normal">
                                Sepolia Testnet
                            </Badge>
                        </CardTitle>
                        <CardDescription className="mt-2">
                            Real-time liquidity pair information
                        </CardDescription>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                        <div className="flex -space-x-2">
                            {token0?.logo ? (
                                <img
                                    src={token0.logo}
                                    alt={token0.symbol}
                                    className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
                                />
                            ) : (
                                <div className="bg-gray-200 border-2 border-white rounded-full w-8 h-8" />
                            )}
                            {token1?.logo ? (
                                <img
                                    src={token1.logo}
                                    alt={token1.symbol}
                                    className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800"
                                />
                            ) : (
                                <div className="bg-gray-200 border-2 border-white rounded-full w-8 h-8" />
                            )}
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                {isLoading && (
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-4 w-full" />
                        <div className="flex space-x-4 pt-4">
                            <Skeleton className="h-24 w-full rounded-xl" />
                            <Skeleton className="h-24 w-full rounded-xl" />
                        </div>
                    </div>
                )}

                {error && (
                    <Alert variant="destructive">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Error fetching pair data</AlertTitle>
                        <AlertDescription>
                            {error.message || "Failed to load Sushiswap pair information"}
                        </AlertDescription>
                    </Alert>
                )}

                {data && (
                    <div className="space-y-6">
                        {/* Token Pair Info */}
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 p-6 rounded-xl">
                            <div className="flex items-center justify-center mb-4">
                                <div className="flex items-center bg-white dark:bg-gray-700 px-4 py-3 rounded-lg shadow">
                                    {token0?.logo && (
                                        <img
                                            src={token0.logo}
                                            alt={token0.symbol}
                                            className="w-10 h-10 rounded-full mr-3"
                                        />
                                    )}
                                    <div>
                                        <h3 className="font-semibold">{token0?.symbol}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {token0?.name}
                                        </p>
                                    </div>
                                </div>

                                <div className="mx-4 text-xl text-indigo-500">+</div>

                                <div className="flex items-center bg-white dark:bg-gray-700 px-4 py-3 rounded-lg shadow">
                                    {token1?.logo && (
                                        <img
                                            src={token1.logo}
                                            alt={token1.symbol}
                                            className="w-10 h-10 rounded-full mr-3"
                                        />
                                    )}
                                    <div>
                                        <h3 className="font-semibold">{token1?.symbol}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {token1?.name}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center">
                                <p className="text-sm text-indigo-500 font-medium">
                                    {token0?.symbol}/{token1?.symbol} Pair
                                </p>
                            </div>
                        </div>

                        {/* Pair Address */}
                        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                            <h4 className="font-medium mb-2 text-sm text-gray-500 dark:text-gray-400">
                                Contract Address
                            </h4>
                            <div className="flex items-center justify-between">
                                <p className="font-mono text-sm break-all pr-4">
                                    {data?.pairAddress}
                                </p>
                                <Badge variant="outline" className="flex-shrink-0">
                                    Copy
                                </Badge>
                            </div>
                        </div>

                        {/* Token Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
                                <h4 className="font-medium mb-3">Token 1 Details</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">
                                            Symbol:
                                        </span>
                                        <span className="font-medium">{token0?.symbol}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">
                                            Name:
                                        </span>
                                        <span className="font-medium">{token0?.name}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">
                                            Decimals:
                                        </span>
                                        <span className="font-medium">{token0?.decimals}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="border rounded-lg p-4 bg-white dark:bg-gray-800">
                                <h4 className="font-medium mb-3">Token 2 Details</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">
                                            Symbol:
                                        </span>
                                        <span className="font-medium">{token1?.symbol}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">
                                            Name:
                                        </span>
                                        <span className="font-medium">{token1?.name}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">
                                            Decimals:
                                        </span>
                                        <span className="font-medium">{token1?.decimals}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default MoralisPairCard
