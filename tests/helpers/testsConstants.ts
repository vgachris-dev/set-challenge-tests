
export class TestConstants {
  // 🌐 API Endpoints
  static readonly API_ENDPOINTS = {
    CHARTS: '/api/charts',
    CHARTS_INVALID: '/api/chartss',
  };

  // ⚙️ HTTP Status Codes
  static readonly HTTP_STATUS = {
    OK: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
  };

  // 🧩 Common Error Messages
  static readonly ERROR_MESSAGES = {
    BAD_REQUEST_PARAMETERS: 'Please check your request parameters',
    DATE_CREATED_DESC_NOT_IMPLEMENTED: 'Currently no order by dateCreated descending has been implemented',
    NOT_FOUND: 'Resource not found',
  };

  // 🔤 Font Weights (for UI tests)
  static readonly FONT_WEIGHT = {
    MEDIUM: 500,
    BOLD: 700,
  };

  // 🔢 Index Constants (for quick array access)
  static readonly INDEX = {
    FIRST: 0,
    SECOND: 1,
    THIRD: 2,
    FOURTH: 3,
    FIFTH: 4,
    SIXTH: 5,
    SEVENTH: 6,
    EIGHTH: 7,
    NINTH: 8,
    TENTH: 9,
  };
}
