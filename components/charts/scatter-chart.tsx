"use client"

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { RunData } from "@/lib/types"

interface ScatterChartComponentProps {
    data: RunData[]
}

export function ScatterChartComponent({ data }: ScatterChartComponentProps) {
    // Transform data for scatter plot (index vs miles)
    const chartData = data.map((item, index) => ({
        index: index + 1,
        miles: item.miles,
        person: item.person,
        date: item.date,
    }))

    return (
        <ResponsiveContainer width="100%" height={350}>
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="index" name="Run #" label={{ value: 'Run Number', position: 'insideBottom', offset: -10 }} />
                <YAxis dataKey="miles" name="Miles" label={{ value: 'Miles', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                                <div className="bg-white p-3 rounded-lg shadow-lg border">
                                    <p className="font-semibold">{data.person}</p>
                                    <p className="text-sm text-gray-600">{data.date}</p>
                                    <p className="text-sm text-green-600">Miles: {data.miles}</p>
                                </div>
                            )
                        }
                        return null
                    }}
                />
                <Legend />
                <Scatter name="Runs" data={chartData} fill="#10b981" />
            </ScatterChart>
        </ResponsiveContainer>
    )
}
