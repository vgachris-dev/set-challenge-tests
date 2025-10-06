# SET Challenge – Automated Testing Suite

This repository contains the automated test suite developed for the **GlobalWebIndex (GWI) SET Challenge**.  
It demonstrates a structured approach to **UI**, **API**, and **Contract** testing using **Playwright**, along with an example **CI/CD workflow** for continuous integration and reporting.

---

## Project Structure

```
set-challenge-tests/
│
├── tests/
│   ├── ui/                  # End-to-end UI tests (Charts Page)
│   ├── api/                 # API functional tests
│   ├── contract/            # API contract validation tests
│   └── helpers/             # Shared constants and utilities
│
├── .github/workflows/
│   └── playwright-ci.yml    # CI pipeline definition
│
├── playwright.config.ts     # Playwright configuration
├── package.json
└── README.md
```

---

## Test Coverage

### UI Tests
Located in: `tests/ui/chartsPage-tests.spec.ts`

These tests cover:
- Charts page load and visibility of key elements  
- Column header interaction and dynamic style changes  
- Default and manual sorting verification  
- Search functionality and create-chart button visibility  

NOTE: UI tests require original data to exist. Otherwise, mocking approach must be implemented.
### API Tests
Located in: `tests/api/charts-api-tests.spec.ts`

These tests validate:
- Sorting and filtering behavior via query parameters  
- Error handling for invalid parameters and endpoints  
- Dataset immutability across identical calls  

### Contract Tests
Located in: `tests/contract/charts-contract-tests.spec.ts`

These tests ensure:
- Response schema matches defined models (`ChartModel`, `ErrorModel`)  
- Proper response types and structures for valid and invalid requests  
- Error consistency (status codes, messages, and data format)

---

## Tech Stack

- **Language:** TypeScript  
- **Framework:** Playwright Test Runner  
- **Assertion Library:** Built-in Playwright expect  
- **CI/CD:** GitHub Actions (Node 20)  
- **Design Pattern:** Page Object Model (for UI tests)

---

## CI/CD Workflow

The CI pipeline runs automatically on **push** or **pull request** to the `master` branch.  
It performs the following steps:

1. **Checkout Repository** – Clones the project.  
2. **Setup Node.js (v20)** – Installs runtime environment.  
3. **Install Dependencies** – Runs `npm ci` for clean installs.  
4. **Mock Application Start** – Skips frontend/backend startup per challenge instructions.  
5. **Run Playwright Tests** – Executes all UI, API, and Contract test suites.  
6. **Publish Test Report** – Uploads the Playwright HTML report as a pipeline artifact.

> **Note:**  
> The original application was intentionally excluded from this repository, so test execution in CI runs against mock endpoints.

---

## Known Bugs and Defects

During execution, several functional and integration issues were identified.

### 1. Invalid `order` parameter not validated properly
**Created by test:** `GetCharts_ShouldThrowError_WhenInvalidOrder`  
**File:** `tests/api/charts-api-tests.spec.ts`

**Steps to Reproduce:**
1. Send `GET /api/charts?orderBy=name&order=sideways`
2. Observe the response.

**Expected Behavior:**  
Should return `400 Bad Request` with:
```json
{ "error": "Invalid order or orderBy parameters" }
```

**Actual Behavior:**  
Returns `200 OK` with normal chart list.

---

### 2. Dataset mutation across consecutive requests
**Created by test:** `GetCharts_ShouldReturnSameResults_WhenDatasetMutated`  
**File:** `tests/api/charts-api-tests.spec.ts`

**Steps to Reproduce:**
1. Call `/api/charts?orderBy=dateCreated&order=asc`
2. Then `/api/charts?orderBy=name&order=asc`
3. Call `/api/charts?orderBy=dateCreated&order=asc` again

**Expected Behavior:**  
Identical requests return identical results.

**Actual Behavior:**  
Results differ, indicating in-memory dataset mutation.  
*(Reproducible only when the UI is not active, as UI calls influence dataset state.)*

---

### 3. Invalid endpoint returns HTML instead of JSON
**Created by test:** `GetCharts_ShouldReturnErrorResponse_WhenInvalidEndpoint`  
**File:** `tests/contract/charts-contract-tests.spec.ts`

**Steps to Reproduce:**
1. Send `GET /api/chartss`
2. Observe the raw response.

**Expected Behavior:**  
`404 Not Found` with JSON:
```json
{ "error": "Endpoint not found" }
```

**Actual Behavior:**  
Returns HTML:
```html
<pre>Cannot GET /api/chartss</pre>
```
and `Content-Type: text/html`, violating the JSON response contract.

---

## Local Setup Instructions

To run the tests locally:

```bash
# Install dependencies
npm ci

# Start application backend on http://localhost:3001, frontend on http://localhost:3000
npm run server 
npm run react

# Run all Playwright tests
npx playwright test --reporter=html

# View the report
npx playwright show-report
```

---

## Viewing Test Reports in GitHub Actions

After each CI run, navigate to:

1. **GitHub → Actions tab → Latest workflow run**
2. Scroll to **Artifacts**
3. Download the **playwright-report.zip** file
4. Extract and open `index.html` locally in your browser to review results

---

## Future Improvements


**Mocking and Component-Level UI Testing**:
Introduce API and UI mocking (e.g., via Playwright route interception or MSW) to enable component-level testing and faster, isolated validation of front-end behavior.

**Test Grouping**:
Organize tests into logical groups such as Smoke, Basic Regression, and Full Regression suites to optimize CI execution times and test focus.

**Visual Testing**:
Add visual regression checks using Playwright’s snapshot comparison to detect unintended UI or layout changes.