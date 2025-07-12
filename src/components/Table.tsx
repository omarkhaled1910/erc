import React from "react"

// Reusable Table Component
export const DataTable = ({
    columns,
    data,
    className = "",
}: {
    columns: {
        header: string
        key: string
        render?: (value: any, row: any, index: number) => React.ReactNode
    }[]
    data: {
        [key: string]: any
    }[]
    className?: string
}) => {
    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                            {columns.map((column, colIndex) => (
                                <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                                    {column.render
                                        ? column.render(row[column.key], row, rowIndex)
                                        : row[column.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
