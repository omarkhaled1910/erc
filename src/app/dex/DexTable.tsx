import { DexQuote } from "@/providers/uniswapV3Provider"
import React from "react"

interface DexTableProps {
    quotes: DexQuote[]
}

const DexTable: React.FC<DexTableProps> = ({ quotes }) => {
    if (!quotes.length) return <div>No quotes available</div>

    const bestPrice = Math.max(...quotes.map(q => q.price))

    return (
        <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            DEX
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Liquidity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Spread
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Arb Opportunity
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {quotes.map(
                        (
                            { dexName, price, liquidity = 0, spread = 0, arbOpportunity = 0 },
                            index
                        ) => {
                            const isBest = price === bestPrice
                            return (
                                <tr
                                    key={dexName}
                                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8 mr-3" />
                                            <span className="font-medium">{dexName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        ${price.toFixed(2)}
                                        {isBest && (
                                            <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                                                Best
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        ${liquidity.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {spread > 0 ? (
                                            <span className="text-red-600">
                                                -{spread.toFixed(3)}%
                                            </span>
                                        ) : (
                                            <span className="text-green-600">
                                                +{Math.abs(spread).toFixed(3)}%
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {arbOpportunity > 0 ? (
                                            <span className="font-bold text-green-600">
                                                +{arbOpportunity.toFixed(2)}%
                                                <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                                                    ${((arbOpportunity * price) / 100).toFixed(2)}{" "}
                                                    per ETH
                                                </span>
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">—</span>
                                        )}
                                    </td>
                                </tr>
                            )
                        }
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default DexTable
