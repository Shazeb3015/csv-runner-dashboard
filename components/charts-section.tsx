"use client"

import { useMemo, useState } from "react"
import {
    Bar,
    BarChart,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartSelector } from "@/components/chart-selector"
import { PieChartComponent } from "@/components/charts/pie-chart"
import { ScatterChartComponent } from "@/components/charts/scatter-chart"
import { RunData } from "@/lib/types"

interface ChartsSectionProps {
    data: RunData[]
}

export function ChartsSection({ data }: ChartsSectionProps) {
    const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'scatter'>('bar')

    const personData = useMemo(() => {
        const totals: Record<string, number> = {}
        data.forEach((run) => {
            totals[run.person] = (totals[run.person] || 0) + run.miles
        })
        return Object.entries(totals).map(([name, miles]) => ({
            name,
            miles,
        }))
    }, [data])

    const dateData = useMemo(() => {
        return [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }, [data])

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-700">Visualizations</h3>
                <ChartSelector selected={chartType} onSelect={setChartType} />
            </div>

            {chartType === 'bar' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Total Miles by Person</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={personData}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}m`}
                                    />
                                    <Tooltip
                                        cursor={{ fill: "transparent" }}
                                        contentStyle={{ borderRadius: "8px" }}
                                    />
                                    <Bar
                                        dataKey="miles"
                                        fill="hsl(142.1 76.2% 36.3%)"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            )}

            {chartType === 'line' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Miles Run Over Time</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dateData}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}m`}
                                    />
                                    <Tooltip contentStyle={{ borderRadius: "8px" }} />
                                    <Line
                                        type="monotone"
                                        dataKey="miles"
                                        stroke="hsl(142.1 76.2% 36.3%)"
                                        strokeWidth={2}
                                        dot={{ r: 4, fill: "hsl(142.1 76.2% 36.3%)" }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            )}

            {chartType === 'pie' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Miles Distribution by Person</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PieChartComponent data={data} />
                    </CardContent>
                </Card>
            )}

            {chartType === 'scatter' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Run Distribution Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScatterChartComponent data={data} />
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
