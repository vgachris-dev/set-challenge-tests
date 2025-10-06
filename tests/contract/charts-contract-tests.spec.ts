import { test, expect } from '@playwright/test';
import {ResponseSchemas} from './responseSchemas';
import { HelperFunctions } from '../helpers/HelperFunctions';
import { TestConstants } from '../helpers/TestsConstants';
test.describe('Charts API Contract', () => {


test('GetCharts_ShouldReturnValidResponse_WhenValidRequest', async ({ request }) => {
  // Act
  const response = await request.get(TestConstants.API_ENDPOINTS.CHARTS);
  const body = await response.json();
  // Assert
  expect(response.status()).toBe(TestConstants.HTTP_STATUS.OK);
  HelperFunctions.validateResponseSchema(body.charts, ResponseSchemas.EXPECTED_CHART_KEYS);
});


test('GetCharts_ShouldReturnErrorResponse_WhenInvalidOrderBy', async ({ request }) => {
  // Arrange
  const endpoint = `${TestConstants.API_ENDPOINTS.CHARTS}?orderBy=invalidField`;

  // Act
  const response = await request.get(endpoint);
  const body = await response.json();

  // Assert
  HelperFunctions.validateErrorResponse(
    body,
    ResponseSchemas.EXPECTED_ERROR_KEYS,
    TestConstants.ERROR_MESSAGES.BAD_REQUEST_PARAMETERS,
    TestConstants.HTTP_STATUS.BAD_REQUEST,
    response.status()
  );
});

test('GetCharts_ShouldReturnErrorResponse_WhenOrderByDateCreatedDesc', async ({ request }) => {
  // Arrange
  const endpoint = `${TestConstants.API_ENDPOINTS.CHARTS}?orderBy=dateCreated&order=desc`;

  // Act
  const response = await request.get(endpoint);
  const body = await response.json();

  // Assert
  HelperFunctions.validateErrorResponse(
    body,
    ResponseSchemas.EXPECTED_ERROR_KEYS,
    TestConstants.ERROR_MESSAGES.DATE_CREATED_DESC_NOT_IMPLEMENTED,
    TestConstants.HTTP_STATUS.SERVER_ERROR,
    response.status()
  );
});
});
