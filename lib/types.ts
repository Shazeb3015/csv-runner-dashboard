export interface RawRunData {
  date: string;
  person: string;
  "miles run": string | number;
}

export interface RunData {
  date: string;
  person: string;
  miles: number;
}

export interface ParseResult {
  data: RunData[];
  error?: string;
}
