import React from "react"

const ProfitChart = () => {
    // Mock data for the chart
    const data = [
        { hour: "00:00", profit: 0.12 },
        { hour: "04:00", profit: 0.08 },
        { hour: "08:00", profit: 0.32 },
        { hour: "12:00", profit: 0.45 },
        { hour: "16:00", profit: 0.67 },
        { hour: "20:00", profit: 0.52 },
    ]

    const maxProfit = Math.max(...data.map(d => d.profit))

    return (
        <div className="h-72">
            <div className="flex items-end justify-between h-5/6">
                {data.map((item, index) => (
                    <div key={index} className="flex flex-col items-center w-1/6">
                        <div className="text-sm text-gray-500 mb-1">{item.hour}</div>
                        <div
                            className="w-4/5 bg-gradient-to-t from-indigo-500 to-indigo-300 rounded-t"
                            style={{ height: `${(item.profit / maxProfit) * 100}%` }}
                        />
                        <div className="text-xs mt-1">{item.profit.toFixed(2)} ETH</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProfitChart
