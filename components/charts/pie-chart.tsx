"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { RunData } from "@/lib/types"

interface PieChartComponentProps {
    data: RunData[]
}

export function PieChartComponent({ data }: PieChartComponentProps) {
    // Aggregate miles by person
    const chartData = data.reduce((acc: { name: string; value: number }[], item) => {
        const existing = acc.find(d => d.name === item.person)
        if (existing) {
            existing.value += item.miles
        } else {
            acc.push({ name: item.person, value: item.miles })
        }
        return acc
    }, [])

    const COLORS = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5']

    return (
        <ResponsiveContainer width="100%" height={350}>
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    )
}
