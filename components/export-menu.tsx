"use client"

import { Download, FileJson, FileSpreadsheet, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RunData } from "@/lib/types"
import { exportAsJSON, exportAsExcel, exportAsCSV } from "@/lib/exporters"

interface ExportMenuProps {
    data: RunData[]
    filename?: string
}

export function ExportMenu({ data, filename = "running-data" }: ExportMenuProps) {
    const handleExport = (format: 'json' | 'excel' | 'csv') => {
        if (data.length === 0) {
            alert("No data to export")
            return
        }

        switch (format) {
            case 'json':
                exportAsJSON(data, filename)
                break
            case 'excel':
                exportAsExcel(data, filename)
                break
            case 'csv':
                exportAsCSV(data, filename)
                break
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export Data
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Export Format</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport('json')} className="gap-2 cursor-pointer">
                    <FileJson className="h-4 w-4" />
                    <span>JSON</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('excel')} className="gap-2 cursor-pointer">
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>Excel (XLSX)</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('csv')} className="gap-2 cursor-pointer">
                    <FileText className="h-4 w-4" />
                    <span>CSV</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
