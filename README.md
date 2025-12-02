# CSV Runner Dashboard

A responsive and interactive web application that enables users to upload CSV files containing running data, automatically validates the data, and displays comprehensive metrics and visualizations.

## Features

- **CSV Upload & Parsing** - Powered by Papaparse for reliable CSV file processing
- **Data Validation** - Automatic validation for incorrect or empty files with user-friendly alerts
- **Clean UI** - Built with shadcn/ui components (Button, Input, Alert, Card) for a polished interface
- **Comprehensive Metrics** - Display overall and per-person running statistics (average, min, max)
- **Data Visualization** - Green-themed bar and line charts using Recharts
- **Responsive Design** - Optimized for all screen sizes and devices

## Limitations

- Only handles small CSV files (not optimized for very large datasets)
- Currently single-user (no login system)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **CSV Parsing**: Papaparse
- **Charts**: Recharts

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `app/` - Next.js App Router pages and layouts
- `components/` - React components including UI components and feature components
- `lib/` - Utility functions and TypeScript types
- `public/` - Static assets and sample CSV files

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
