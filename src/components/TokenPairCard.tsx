import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage } from "./ui/avatar"

const TokenPairCard = ({ data }: { data: { token0: any; token1: any; pairAddress: string } }) => {
    const { token0, token1, pairAddress } = data

    return (
        <Card className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
            <CardHeader className="bg-gray-50 p-4 border-b">
                <CardTitle className="text-lg font-semibold text-gray-800">
                    Liquidity Pool Pair
                </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
                {/* Token Pair Header */}
                <div className="flex items-center justify-center mb-6">
                    <div className="flex -space-x-2">
                        <Avatar className="border-2 border-white">
                            <AvatarImage
                                src={token0.logo}
                                alt={token0.name}
                                className="bg-gray-200"
                            />
                        </Avatar>
                        <Avatar className="border-2 border-white">
                            <AvatarImage
                                src={token1.logo}
                                alt={token1.name}
                                className="bg-gray-200"
                            />
                        </Avatar>
                    </div>
                    <h2 className="ml-4 text-xl font-bold text-gray-900">
                        {token0.symbol}/{token1.symbol}
                    </h2>
                </div>

                {/* Token Details */}
                <div className="space-y-4">
                    {[token0, token1].map((token, index) => (
                        <div
                            key={token.address}
                            className="flex items-start p-4 bg-gray-50 rounded-lg"
                        >
                            <Avatar className="h-10 w-10 mr-3">
                                <AvatarImage src={token.logo} alt={token.name} />
                            </Avatar>
                            <div>
                                <h3 className="font-medium text-gray-900">
                                    {token.name} ({token.symbol})
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    <span className="font-mono block truncate max-w-[200px]">
                                        {token.address}
                                    </span>
                                </p>
                                <div className="mt-1 text-xs text-gray-400">
                                    Decimals: {token.decimals}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pair Address */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Pair Contract:</h4>
                    <p className="text-sm font-mono p-3 bg-gray-50 rounded-md break-all">
                        {pairAddress}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

export default TokenPairCard
