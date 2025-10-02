
export interface ChartModel {
  name: string;
  created_at: number;
  modified_at: number;
}


export const EXPECTED_CHART_KEYS: string[] = [
  'name',
  'created_at',
  'modified_at',
];


export interface ErrorModel {
  error: string;
}

export const EXPECTED_ERROR_KEYS: string[] = ['error'];
