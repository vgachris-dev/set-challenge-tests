import { Page, Locator } from '@playwright/test';

export class ChartsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly searchInput: Locator;
  readonly createButton: Locator;
  readonly sortByName: Locator;
  readonly sortByDateCreated: Locator;
  readonly sortByLastModified: Locator;
  readonly chartRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Charts' });
    this.searchInput = page.getByPlaceholder('Search charts');
    this.createButton = page.getByRole('button', { name: 'Create a chart' });
    this.sortByName = page.getByRole('button', { name: 'Name' });
    this.sortByDateCreated = page.getByRole('button', { name: 'Date created' });
    this.sortByLastModified = page.getByRole('button', { name: 'Last modified' });
    this.chartRows = page.locator('.root .MuiGrid-container').filter({ has: page.locator('p.MuiTypography-root') });
  }

  async goto() {
    await this.page.goto('/');
    await this.heading.waitFor();
  }

  async getChartNames(): Promise<string[]> {
    return this.chartRows.locator('p.MuiTypography-root').allTextContents();
  }

  async sortBy(by: 'name' | 'dateCreated' | 'lastModified') {
    if (by === 'name') await this.sortByName.click();
    if (by === 'dateCreated') await this.sortByDateCreated.click();
    if (by === 'lastModified') await this.sortByLastModified.click();
  }
}
