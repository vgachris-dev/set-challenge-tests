import { test, expect } from '@playwright/test';
import { ChartsPage } from './pages/ChartsPage';
import { FONT_WEIGHT, INDEX } from '../helpers/testsConsts';
import { getFontWeight } from '../helpers/helperFunctions';


test.describe('Charts Page (UI E2E)', () => {

  let chartsPage: ChartsPage;
  test.beforeEach(async ({ page }) => {
    chartsPage = new ChartsPage(page);
    await chartsPage.goto();
  });



  test('Verify Charts page loads and all elements are visible', async ({ page }) => {
    // Act
    const names = await chartsPage.getChartNames();
    // Assert
    await expect(chartsPage.searchChartsInput).toBeVisible();
    await expect(chartsPage.createChartButton).toBeVisible();
    await expect(chartsPage.header).toBeVisible();
    expect(names.length).toBeGreaterThan(0);
  });

test('Verify column headers switch from medium to bold when clicked', async () => {
  // Arrange
  const beforeWeights = await Promise.all(chartsPage.columnHeaderButtons.map(h => getFontWeight(h)));
  // Act
  const afterWeights: number[] = [];
  for (const header of chartsPage.columnHeaderButtons) {
    await header.click();
    afterWeights.push(await getFontWeight(header));
  }
  // Assert
  for (const weight of beforeWeights) {
    expect(weight).toBe(FONT_WEIGHT.MEDIUM);
  }
  for (const weight of afterWeights) {
    expect(weight).toBe(FONT_WEIGHT.BOLD);
  }
});


  test('Verify default sorting is by name', async ({ page }) => {
    // Act
    const names = await chartsPage.getChartNames();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    // Assert
    expect(names).toEqual(sorted);
  });



  test('Verify successful sorting by date created', async ({ page }) => {
    // Act
    await chartsPage.dateCreatedColumnHeaderButton.click();
    const rows = await chartsPage.chartRows.allTextContents();
    const dates = parseDatesFromRows(rows, INDEX.SECOND);
    const sorted = [...dates].sort((a, b) => a - b);
    // Assert
    expect(dates).toEqual(sorted);
  });

  test('Verify successful sorting by last modified', async ({ page }) => {
    // Act
    await chartsPage.lastModifiedColumnHeaderButton.click();
    const rows = await chartsPage.chartRows.allTextContents();
    const dates = parseDatesFromRows(rows, INDEX.THIRD);
    const sorted = [...dates].sort((a, b) => a - b);
    // Assert
    expect(dates).toEqual(sorted);
  });


  test('Verify create chart button is visible ', async ({ page }) => {
    // Assert
    await expect(chartsPage.createChartButton).toBeVisible();
  });

  test('Verify search charts input functionality', async ({ page }) => {
    // Act
    await chartsPage.searchChartsInput.waitFor({ state: 'visible' });
    const firstChart = (await chartsPage.getChartNames())[INDEX.FIRST];
    await chartsPage.searchChartsInput.fill(firstChart);
    // Assert
    const visibleNames = await chartsPage.getChartNames();
    expect(visibleNames).toContain(firstChart);
  });



  const parseDatesFromRows = (rows: string[], columnIndex: number): number[] =>
    rows
      .map(r => r.split('\n')[columnIndex])
      .map(d => new Date(d).getTime());

});
