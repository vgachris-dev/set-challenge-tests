export class ResponseSchemas {
  static readonly EXPECTED_CHART_KEYS: string[] = [
    "name",
    "created_at",
    "modified_at",
  ];

  static readonly EXPECTED_ERROR_KEYS: string[] = ["error"];
}

export interface ChartModel {
  name: string;
  created_at: number;
  modified_at: number;
}

export interface ErrorModel {
  error: string;
}
