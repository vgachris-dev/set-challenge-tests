import { test, expect } from '@playwright/test';
import { ChartsPage } from './pages/ChartsPage';

test.describe('Charts Page (UI E2E)', () => {
  test.beforeEach(async ({ page }) => {
    const chartsPage = new ChartsPage(page);
    await chartsPage.goto();
  });

  test('renders the list of charts', async ({ page }) => {
    const chartsPage = new ChartsPage(page);

    await expect(chartsPage.heading).toBeVisible();
    const names = await chartsPage.getChartNames();
    expect(names.length).toBeGreaterThan(0);
  });

  test('sorts by name ascending', async ({ page }) => {
    const chartsPage = new ChartsPage(page);

    await chartsPage.sortBy('name');
    const names = await chartsPage.getChartNames();

    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  test('sorts by name descending', async ({ page }) => {
    const chartsPage = new ChartsPage(page);

    await chartsPage.sortBy('name'); // click once = asc
    await chartsPage.sortBy('name'); // click again = desc
    const names = await chartsPage.getChartNames();

    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });

  test('sorts by date created ascending', async ({ page }) => {
    const chartsPage = new ChartsPage(page);

    await chartsPage.sortBy('dateCreated');
    const rows = await chartsPage.chartRows.allTextContents();

    const dates = rows
      .map(r => r.split('\n')[1]) // 2nd column
      .map(d => new Date(d).getTime());

    const sorted = [...dates].sort((a, b) => a - b);
    expect(dates).toEqual(sorted);
  });

  test('sorts by date created descending', async ({ page }) => {
    const chartsPage = new ChartsPage(page);

    await chartsPage.sortBy('dateCreated');
    await chartsPage.sortBy('dateCreated'); // toggle
    const rows = await chartsPage.chartRows.allTextContents();

    const dates = rows
      .map(r => r.split('\n')[1]) // 2nd column
      .map(d => new Date(d).getTime());

    const sorted = [...dates].sort((a, b) => b - a);
    expect(dates).toEqual(sorted);
  });

  test('sorts by last modified ascending', async ({ page }) => {
    const chartsPage = new ChartsPage(page);

    await chartsPage.sortBy('lastModified');
    const rows = await chartsPage.chartRows.allTextContents();

    const dates = rows
      .map(r => r.split('\n')[2]) // 3rd column
      .map(d => new Date(d).getTime());

    const sorted = [...dates].sort((a, b) => a - b);
    expect(dates).toEqual(sorted);
  });

  test('sorts by last modified descending', async ({ page }) => {
    const chartsPage = new ChartsPage(page);

    await chartsPage.sortBy('lastModified');
    await chartsPage.sortBy('lastModified'); // toggle
    const rows = await chartsPage.chartRows.allTextContents();

    const dates = rows
      .map(r => r.split('\n')[2]) // 3rd column
      .map(d => new Date(d).getTime());

    const sorted = [...dates].sort((a, b) => b - a);
    expect(dates).toEqual(sorted);
  });

  // Placeholder for error/empty state → will use route interception
  test('handles empty state gracefully', async ({ page }) => {
    await page.route('**/api/charts**', route => {
      route.fulfill({ status: 200, body: JSON.stringify([]) });
    });
    const chartsPage = new ChartsPage(page);
    await chartsPage.goto();

    // await expect(chartsPage.emptyState).toBeVisible();
  });

  test('shows error message on server error', async ({ page }) => {
    await page.route('**/api/charts**', route => {
      route.fulfill({ status: 500, body: 'Internal Server Error' });
    });
    const chartsPage = new ChartsPage(page);
    await chartsPage.goto();

    // await expect(chartsPage.errorMessage).toBeVisible();
  });
});
