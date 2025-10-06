import { test, expect } from '@playwright/test';
import { ChartsPage } from './pages/ChartsPage';
import { HelperFunctions } from '../helpers/HelperFunctions';
import { TestConstants } from '../helpers/TestsConstants';


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
  const beforeWeights = await Promise.all(
    chartsPage.columnHeaderButtons.map(h => HelperFunctions.getFontWeight(h))
  );

  // Act
  const afterWeights: number[] = [];
  for (const header of chartsPage.columnHeaderButtons) {
    await header.click();
    afterWeights.push(await HelperFunctions.getFontWeight(header));
  }

  // Assert
  for (let i = 0; i < chartsPage.columnHeaderButtons.length; i++) {
    const header = chartsPage.columnHeaderButtons[i];
    const before = beforeWeights[i];
    const after = afterWeights[i];

    // If it's the name column, it's already bold (default)
    if (header === chartsPage.nameColumnHeaderButton) {
      expect(before).toBe(TestConstants.FONT_WEIGHT.BOLD);
      expect(after).toBe(TestConstants.FONT_WEIGHT.BOLD);
    } else {
      expect(before).toBe(TestConstants.FONT_WEIGHT.MEDIUM);
      expect(after).toBe(TestConstants.FONT_WEIGHT.BOLD);
    }
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
    const dates = HelperFunctions.parseDatesFromRows(rows, TestConstants.INDEX.SECOND);
    const sorted = [...dates].sort((a, b) => a - b);
    // Assert
    expect(dates).toEqual(sorted);
  });

  test('Verify successful sorting by last modified', async ({ page }) => {
    // Act
    await chartsPage.lastModifiedColumnHeaderButton.click();
    const rows = await chartsPage.chartRows.allTextContents();
    const dates = HelperFunctions.parseDatesFromRows(rows, TestConstants.INDEX.THIRD);
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
    const firstChart = (await chartsPage.getChartNames())[TestConstants.INDEX.FIRST];
    await chartsPage.searchChartsInput.fill(firstChart);
    const visibleNames = await chartsPage.getChartNames();
    // Assert
    expect(visibleNames).toContain(firstChart);
  });

});
