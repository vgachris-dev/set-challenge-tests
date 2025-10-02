import { test, expect } from '@playwright/test';
import { API_ENDPOINTS, HTTP_STATUS, ERROR_MESSAGES } from '../helpers/testsConsts';
import { EXPECTED_CHART_KEYS, EXPECTED_ERROR_KEYS } from './models';

test.describe('Charts API Contract', () => {
  test('Response schema should match expected structure', async ({ request }) => {
    // Arrange
    const endpoint = API_ENDPOINTS.CHARTS;

    // Act
    const response = await request.get(endpoint);
    const body = await response.json();

    // Assert
    expect(response.status()).toBe(HTTP_STATUS.OK);
    expect(body).toHaveProperty('charts');
    expect(Array.isArray(body.charts)).toBe(true);

    for (const chart of body.charts) {
      // Check expected keys exist
      for (const key of EXPECTED_CHART_KEYS) {
        expect(chart).toHaveProperty(key);
      }
      // Check types
      expect(typeof chart.name).toBe('string');
      expect(typeof chart.created_at).toBe('number');
      expect(typeof chart.modified_at).toBe('number');
    }
  });

  test('Should not return extra unexpected fields in success response', async ({ request }) => {
    // Arrange
    const endpoint = API_ENDPOINTS.CHARTS;

    // Act
    const response = await request.get(endpoint);
    const { charts } = await response.json();

    // Assert
    expect(response.status()).toBe(HTTP_STATUS.OK);

    for (const chart of charts) {
      const keys = Object.keys(chart).sort();
      expect(keys).toEqual(EXPECTED_CHART_KEYS.sort()); // exact match
    }
  });

  test('Error response should follow contract on 400 Bad Request', async ({ request }) => {
    // Arrange
    const endpoint = `${API_ENDPOINTS.CHARTS}?orderBy=invalidField`;

    // Act
    const response = await request.get(endpoint);
    const body = await response.json();

    // Assert
    expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    for (const key of EXPECTED_ERROR_KEYS) {
      expect(body).toHaveProperty(key);
    }
    expect(typeof body.error).toBe('string');
    expect(body.error).toBe(ERROR_MESSAGES.BAD_REQUEST_PARAMETERS);
  });

  test('Error response should follow contract on 500 Server Error', async ({ request }) => {
    // Arrange
    const endpoint = `${API_ENDPOINTS.CHARTS}?orderBy=dateCreated&order=desc`;

    // Act
    const response = await request.get(endpoint);
    const body = await response.json();

    // Assert
    expect(response.status()).toBe(HTTP_STATUS.SERVER_ERROR);
    for (const key of EXPECTED_ERROR_KEYS) {
      expect(body).toHaveProperty(key);
    }
    expect(typeof body.error).toBe('string');
    expect(body.error).toBe(ERROR_MESSAGES.DATE_CREATED_DESC_NOT_IMPLEMENTED);
  });
});
