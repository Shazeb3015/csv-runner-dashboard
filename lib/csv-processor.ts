import Papa from 'papaparse';

export interface CSVProcessConfig {
  chunkSize?: number;
  onProgress?: (progress: number) => void;
  onChunkComplete?: (chunk: any[], totalProcessed: number) => void;
}

export interface ProcessResult<T> {
  data: T[];
  errors: Papa.ParseError[];
  totalRows: number;
}

/**
 * Process CSV file with streaming support for large files
 */
export function processCSVFile<T = any>(
  file: File,
  config: CSVProcessConfig = {}
): Promise<ProcessResult<T>> {
  const { chunkSize = 10000, onProgress, onChunkComplete } = config;

  return new Promise((resolve, reject) => {
    const allData: T[] = [];
    const allErrors: Papa.ParseError[] = [];
    let totalProcessed = 0;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      chunk: (results, parser) => {
        const chunk = results.data as T[];
        allData.push(...chunk);
        totalProcessed += chunk.length;

        if (results.errors.length > 0) {
          allErrors.push(...results.errors);
        }

        // Calculate progress based on bytes processed
        const progress = Math.min(
          Math.round((totalProcessed / Math.max(file.size / 100, 1)) * 100),
          99
        );

        onProgress?.(progress);
        onChunkComplete?.(chunk, totalProcessed);
      },
      complete: (results) => {
        onProgress?.(100);

        resolve({
          data: allData,
          errors: allErrors,
          totalRows: allData.length,
        });
      },
      error: (error) => {
        reject(error);
      },
      chunkSize: chunkSize * 1024, // Convert KB to bytes
    });
  });
}

/**
 * Validate CSV file size (returns true if acceptable, false if too large)
 */
export function validateFileSize(file: File, maxSizeMB: number = 50): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
