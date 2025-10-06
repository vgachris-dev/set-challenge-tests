import { expect, Locator } from '@playwright/test';



export class HelperFunctions {
  static async getFontWeight(locator: Locator): Promise<number> {
    return parseInt(
      await locator.evaluate(el => getComputedStyle(el).fontWeight),
      10
    );
  }

   static parseDatesFromRows(rows: string[], columnIndex: number): number[] {
    return rows
      .map(r => r.split('\n')[columnIndex])
      .map(d => new Date(d).getTime());
  }

  static validateResponseSchema(items: any[], expectedKeys: string[]) {
    expect(Array.isArray(items)).toBe(true);

    const sortedExpected = [...expectedKeys].sort();
    for (const item of items) {
      const keys = Object.keys(item).sort();
      expect(keys).toEqual(sortedExpected);

      for (const key of expectedKeys) {
        expect(item[key]).not.toBeUndefined();
      }
    }
  }

static validateErrorResponse(
  responseBody: any,
  expectedKeysOrSubstring: string[] | string,
  expectedMessage: string,
  expectedStatus: number,
  actualStatus: number
) {
  expect(actualStatus).toBe(expectedStatus);

  
  if (typeof responseBody === 'string') {
    expect(responseBody).toContain(expectedMessage);
    if (typeof expectedKeysOrSubstring === 'string') {
      expect(responseBody).toContain(expectedKeysOrSubstring);
    }
    return;
  }

 
  if (typeof responseBody === 'object') {
    const expectedKeys = Array.isArray(expectedKeysOrSubstring)
      ? expectedKeysOrSubstring
      : [expectedKeysOrSubstring];

    for (const key of expectedKeys) {
      expect(responseBody).toHaveProperty(key);
    }

    expect(typeof responseBody.error).toBe('string');
    expect(responseBody.error).toBe(expectedMessage);
    return;
  }

  throw new Error(`Unsupported response type: ${typeof responseBody}`);
}

}
