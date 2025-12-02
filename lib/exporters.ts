import * as XLSX from 'xlsx';
import { RunData } from './types';

/**
 * Export data as JSON file
 */
export function exportAsJSON(data: RunData[], filename: string = 'running-data') {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    downloadFile(blob, `${filename}.json`);
}

/**
 * Export data as Excel (XLSX) file
 */
export function exportAsExcel(data: RunData[], filename: string = 'running-data') {
    // Convert data to worksheet format
    const worksheetData = data.map(row => ({
        'Date': row.date,
        'Person': row.person,
        'Miles Run': row.miles,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Running Data');

    // Generate Excel file and download
    XLSX.writeFile(workbook, `${filename}.xlsx`);
}

/**
 * Export data as CSV file
 */
export function exportAsCSV(data: RunData[], filename: string = 'running-data') {
    // Convert data to worksheet format
    const worksheetData = data.map(row => ({
        'date': row.date,
        'person': row.person,
        'miles run': row.miles,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    downloadFile(blob, `${filename}.csv`);
}

/**
 * Utility function to trigger file download
 */
function downloadFile(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
