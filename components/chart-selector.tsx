"use client"

import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, ScatterChart as ScatterChartIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChartSelectorProps {
    selected: 'bar' | 'line' | 'pie' | 'scatter'
    onSelect: (type: 'bar' | 'line' | 'pie' | 'scatter') => void
}

export function ChartSelector({ selected, onSelect }: ChartSelectorProps) {
    const charts = [
        { type: 'bar' as const, icon: BarChart3, label: 'Bar' },
        { type: 'line' as const, icon: LineChartIcon, label: 'Line' },
        { type: 'pie' as const, icon: PieChartIcon, label: 'Pie' },
        { type: 'scatter' as const, icon: ScatterChartIcon, label: 'Scatter' },
    ]

    return (
        <div className="flex gap-2">
            {charts.map((chart) => (
                <Button
                    key={chart.type}
                    variant={selected === chart.type ? "default" : "outline"}
                    size="sm"
                    onClick={() => onSelect(chart.type)}
                    className={`gap-2 ${selected === chart.type ? "bg-green-600 hover:bg-green-700" : "hover:bg-green-50"}`}
                >
                    <chart.icon className="h-4 w-4" />
                    {chart.label}
                </Button>
            ))}
        </div>
    )
}
