import { Page, Locator } from '@playwright/test';

export class ChartsPage {
  readonly page: Page;
  readonly header: Locator;
  readonly searchChartsInput: Locator;
  readonly createChartButton: Locator;
  readonly nameColumnHeaderButton: Locator;
  readonly dateCreatedColumnHeaderButton: Locator;
  readonly lastModifiedColumnHeaderButton: Locator;
  readonly chartRows: Locator;
  static readonly NAME_COLUMN_TEXT: string = 'Name';
  static readonly DATE_CREATED_COLUMN_TEXT: string = 'Date created';
  static readonly LAST_MODIFIED_COLUMN_TEXT: string = 'Last modified';
 readonly columnHeaderButtons: Locator[];

  constructor(page: Page) {
    this.page = page;
    this.header = page.getByRole('heading', { name: 'Charts' });
    this.searchChartsInput = page.getByPlaceholder('Search charts');
    this.createChartButton = page.getByRole('button', { name: 'Create a chart' });
    this.nameColumnHeaderButton = page.getByRole('button', { name: 'Name' });
    this.dateCreatedColumnHeaderButton = page.getByRole('button', { name: 'Date created' });
    this.lastModifiedColumnHeaderButton = page.getByRole('button', { name: 'Last modified' });
    this.chartRows = page.locator('.root .MuiGrid-container:not(.header)');
    this.columnHeaderButtons = [
      this.nameColumnHeaderButton,
      this.dateCreatedColumnHeaderButton,
      this.lastModifiedColumnHeaderButton,
                              ];
  }

  async goto() {
    await this.page.goto('/');
    await this.header.waitFor();
  }

  async getChartNames(): Promise<string[]> {
    return this.chartRows.allTextContents();
  }

}
