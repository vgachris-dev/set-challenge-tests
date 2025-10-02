import { Locator, Page } from '@playwright/test';

/**
 * Returns the computed font weight (as a number) for a given locator.
 */
export async function getFontWeight(locator: Locator): Promise<number> {
  return parseInt(
    await locator.evaluate(el => getComputedStyle(el).fontWeight),
    10
  );
}