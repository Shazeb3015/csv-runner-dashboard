"use client"

import { useState } from "react"
import Papa from "papaparse"
import { Upload, FileUp, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RawRunData, RunData } from "@/lib/types"

interface CsvUploaderProps {
    onDataParsed: (data: RunData[], fileName: string) => void
    onError: (error: string) => void
}

export function CsvUploader({ onDataParsed, onError }: CsvUploaderProps) {
    const [isDragging, setIsDragging] = useState(false)

    const handleFile = (file: File) => {
        if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
            onError("Please upload a valid CSV file.")
            return
        }

        Papa.parse<RawRunData>(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.errors.length > 0) {
                    onError(`Error parsing CSV: ${results.errors[0].message}`)
                    return
                }

                const rawData = results.data
                if (rawData.length === 0) {
                    onError("The CSV file is empty.")
                    return
                }

                // Validate headers
                const firstRow = rawData[0]
                if (!("date" in firstRow) || !("person" in firstRow) || !("miles run" in firstRow)) {
                    onError("Invalid CSV headers. Expected: date, person, miles run")
                    return
                }

                // Transform and validate data
                const parsedData: RunData[] = []
                for (const row of rawData) {
                    const miles = Number(row["miles run"])
                    if (isNaN(miles)) {
                        onError("Invalid data: 'miles run' must be a number.")
                        return
                    }
                    parsedData.push({
                        date: row.date,
                        person: row.person,
                        miles: miles,
                    })
                }

                onDataParsed(parsedData, file.name)
            },
            error: (error) => {
                onError(`Error reading file: ${error.message}`)
            },
        })
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) {
            handleFile(file)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            handleFile(file)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto border-dashed border-2 hover:border-green-500 transition-colors">
            <CardContent
                className={`flex flex-col items-center justify-center p-10 space-y-4 cursor-pointer ${isDragging ? "bg-green-50/50" : ""
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="p-4 bg-green-100 rounded-full">
                    <Upload className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-center space-y-1">
                    <h3 className="text-lg font-semibold text-gray-700">Upload CSV</h3>
                    <p className="text-sm text-gray-500">Drag and drop or click to browse</p>
                </div>
                <Input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    id="csv-upload"
                    onChange={handleInputChange}
                />
                <Button asChild variant="outline" className="mt-2">
                    <label htmlFor="csv-upload" className="cursor-pointer">
                        Select File
                    </label>
                </Button>
            </CardContent>
        </Card>
    )
}
