"use client"

import { useState } from "react"
import { CsvUploader } from "@/components/csv-uploader"
import { MetricsCards } from "@/components/metrics-cards"
import { ChartsSection } from "@/components/charts-section"
import { DataTable } from "@/components/data-table"
import { ExportMenu } from "@/components/export-menu"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RunData } from "@/lib/types"
import { AlertCircle, Table2 } from "lucide-react"

export default function Home() {
  const [data, setData] = useState<RunData[] | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDataParsed = (parsedData: RunData[], name: string) => {
    setData(parsedData)
    setFileName(name)
    setError(null)
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
    setData(null)
    setFileName(null)
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Runner Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Upload your running data to visualize your progress.
          </p>
        </div>

        <div className="space-y-6">
          <CsvUploader onDataParsed={handleDataParsed} onError={handleError} />

          {error && (
            <Alert variant="destructive" className="max-w-md mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {data && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  Results for <span className="text-green-600">{fileName}</span>
                </h2>
                <div className="flex gap-3">
                  <ExportMenu data={data} filename={fileName || "running-data"} />
                  <button
                    onClick={() => {
                      setData(null)
                      setFileName(null)
                    }}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    Clear Data
                  </button>
                </div>
              </div>

              <MetricsCards data={data} />
              <ChartsSection data={data} />

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Table2 className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-700">Data Table</h3>
                </div>
                <DataTable data={data} />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
