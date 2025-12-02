"use client"

import { useMemo } from "react"
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
    Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RunData } from "@/lib/types"

interface ChartsSectionProps {
    data: RunData[]
}

export function ChartsSection({ data }: ChartsSectionProps) {
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
        // Sort by date just in case
        return [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }, [data])

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
                <CardHeader>
                    <CardTitle>Total Miles by Person</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <div className="h-[300px] w-full">
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
                                    fill="hsl(142.1 76.2% 36.3%)" // Green-600
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
            <Card className="col-span-1">
                <CardHeader>
                    <CardTitle>Miles Run Over Time</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <div className="h-[300px] w-full">
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
        </div>
    )
}
