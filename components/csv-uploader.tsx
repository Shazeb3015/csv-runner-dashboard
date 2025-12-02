"use client"

import { useState } from "react"
import { Upload, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RawRunData, RunData } from "@/lib/types"
import { processCSVFile, validateFileSize, formatFileSize } from "@/lib/csv-processor"

interface CsvUploaderProps {
    onDataParsed: (data: RunData[], fileName: string) => void
    onError: (error: string) => void
}

export function CsvUploader({ onDataParsed, onError }: CsvUploaderProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [currentFile, setCurrentFile] = useState<string | null>(null)

    const handleFile = async (file: File) => {
        if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
            onError("Please upload a valid CSV file.")
            return
        }

        // Validate file size (max 50MB)
        if (!validateFileSize(file, 50)) {
            onError(`File too large (${formatFileSize(file.size)}). Maximum size is 50MB.`)
            return
        }

        setIsProcessing(true)
        setCurrentFile(file.name)
        setUploadProgress(0)

        try {
            const result = await processCSVFile<RawRunData>(file, {
                onProgress: (progress) => {
                    setUploadProgress(progress)
                },
            })

            if (result.errors.length > 0) {
                onError(`Error parsing CSV: ${result.errors[0].message}`)
                setIsProcessing(false)
                setCurrentFile(null)
                return
            }

            const rawData = result.data
            if (rawData.length === 0) {
                onError("The CSV file is empty.")
                setIsProcessing(false)
                setCurrentFile(null)
                return
            }

            // Validate headers
            const firstRow = rawData[0]
            if (!("date" in firstRow) || !("person" in firstRow) || !("miles run" in firstRow)) {
                onError("Invalid CSV headers. Expected: date, person, miles run")
                setIsProcessing(false)
                setCurrentFile(null)
                return
            }

            // Transform and validate data
            const parsedData: RunData[] = []
            for (const row of rawData) {
                const miles = Number(row["miles run"])
                if (isNaN(miles)) {
                    onError("Invalid data: 'miles run' must be a number.")
                    setIsProcessing(false)
                    setCurrentFile(null)
                    return
                }
                parsedData.push({
                    date: row.date,
                    person: row.person,
                    miles: miles,
                })
            }

            onDataParsed(parsedData, file.name)
            setIsProcessing(false)
            setCurrentFile(null)
            setUploadProgress(0)
        } catch (error) {
            onError(`Error reading file: ${error instanceof Error ? error.message : 'Unknown error'}`)
            setIsProcessing(false)
            setCurrentFile(null)
        }
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
                className={`flex flex-col items-center justify-center p-10 space-y-4 ${isProcessing ? "" : "cursor-pointer"} ${isDragging ? "bg-green-50/50" : ""
                    }`}
                onDragOver={!isProcessing ? handleDragOver : undefined}
                onDragLeave={!isProcessing ? handleDragLeave : undefined}
                onDrop={!isProcessing ? handleDrop : undefined}
            >
                {isProcessing ? (
                    <>
                        <div className="w-full space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Processing {currentFile}...</span>
                                <span className="text-green-600 font-semibold">{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} className="h-2" />
                            <p className="text-xs text-gray-500 text-center">
                                {uploadProgress < 100 ? "Please wait..." : "Finalizing..."}
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="p-4 bg-green-100 rounded-full">
                            <Upload className="w-8 h-8 text-green-600" />
                        </div>
                        <div className="text-center space-y-1">
                            <h3 className="text-lg font-semibold text-gray-700">Upload CSV</h3>
                            <p className="text-sm text-gray-500">Drag and drop or click to browse</p>
                            <p className="text-xs text-gray-400">Maximum file size: 50MB</p>
                        </div>
                        <Input
                            type="file"
                            accept=".csv"
                            className="hidden"
                            id="csv-upload"
                            onChange={handleInputChange}
                            disabled={isProcessing}
                        />
                        <Button asChild variant="outline" className="mt-2">
                            <label htmlFor="csv-upload" className="cursor-pointer">
                                Select File
                            </label>
                        </Button>
                    </>
                )}
            </CardContent>
        </Card>
    )
}

