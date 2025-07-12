import { formatPrice, formatLiquidity, formatSpread, formatAddress } from "@/utils"
import { DataTable } from "@/components/Table"
import { DexQuote } from "@/providers/baseDexProvider"

export default function DexPriceTable({ dexData = [] }: { dexData: DexQuote[] }) {
    // Find the best price (lowest for buying)
    const bestPriceIndex =
        dexData.length > 0
            ? dexData.reduce((bestIndex, current, index) => {
                  const currentPrice = current.price
                  const bestPrice = dexData[bestIndex].price
                  return currentPrice > 0 && (bestPrice === 0 || currentPrice < bestPrice)
                      ? index
                      : bestIndex
              }, 0)
            : -1

    const columns = [
        {
            header: "Exchange",
            key: "dexName",
            render: (value: string) => (
                <div className="flex items-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8 mr-3"></div>
                    <span className="font-medium">{value}</span>
                </div>
            ),
        },
        {
            header: "Price",
            key: "price",
            render: (value: number, row: any, index: number) => (
                <div className="flex items-center">
                    <span className="font-medium">{formatPrice(value)}</span>
                    {index === bestPriceIndex && value > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                            Best
                        </span>
                    )}
                </div>
            ),
        },
        {
            header: "Liquidity",
            key: "liquidity",
            render: (value: number) => (
                <span className="font-medium">{formatLiquidity(value)}</span>
            ),
        },
        {
            header: "Spread",
            key: "spread",
            render: (value: number) => (
                <span className={`${value > 0 ? "text-green-600" : "text-gray-400"}`}>
                    {value > 0 ? "+" : ""}
                    {formatSpread(value)}
                </span>
            ),
        },
        {
            header: "Arbitrage",
            key: "arbOpportunity",
            render: (value: number) => (
                <span className={`${value > 0 ? "text-green-600" : "text-gray-400"}`}>
                    {value > 0 ? `+${value.toFixed(3)}%` : "—"}
                </span>
            ),
        },
        {
            header: "Contract",
            key: "factoryAddress",
            render: (value: string) => (
                <a
                    href={`https://sepolia.etherscan.io/address/${value}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                >
                    {formatAddress(value)}
                </a>
            ),
        },
    ]

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">DEX Price Comparison</h2>
                <div className="text-sm text-gray-500">
                    {dexData.length} exchange{dexData.length !== 1 ? "s" : ""} found
                </div>
            </div>

            {dexData.length > 0 ? (
                <DataTable
                    columns={columns}
                    data={dexData.map((item, index) => ({ ...item, index }))}
                    className="shadow-sm"
                />
            ) : (
                <div className="text-center py-8 text-gray-500">No DEX data available</div>
            )}
        </div>
    )
}
