"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RunData } from "@/lib/types"
import { Activity, TrendingUp, ArrowUp, ArrowDown } from "lucide-react"

interface MetricsCardsProps {
    data: RunData[]
}

export function MetricsCards({ data }: MetricsCardsProps) {
    const metrics = useMemo(() => {
        if (data.length === 0) {
            return {
                totalMiles: 0,
                averageMiles: 0,
                maxMiles: 0,
                minMiles: 0,
            }
        }

        const totalMiles = data.reduce((sum, run) => sum + run.miles, 0)
        const averageMiles = totalMiles / data.length
        const maxMiles = Math.max(...data.map((run) => run.miles))
        const minMiles = Math.min(...data.map((run) => run.miles))

        return {
            totalMiles,
            averageMiles,
            maxMiles,
            minMiles,
        }
    }, [data])

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Miles</CardTitle>
                    <Activity className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{metrics.totalMiles.toFixed(1)}</div>
                    <p className="text-xs text-muted-foreground">Overall distance run</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average / Run</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{metrics.averageMiles.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">Miles per session</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Max Distance</CardTitle>
                    <ArrowUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{metrics.maxMiles.toFixed(1)}</div>
                    <p className="text-xs text-muted-foreground">Longest single run</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Min Distance</CardTitle>
                    <ArrowDown className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{metrics.minMiles.toFixed(1)}</div>
                    <p className="text-xs text-muted-foreground">Shortest single run</p>
                </CardContent>
            </Card>
        </div>
    )
}
