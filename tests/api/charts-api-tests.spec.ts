import { test, expect } from "@playwright/test";
import { TestConstants } from "../helpers/TestsConstants";

test.describe("Charts API Tests", () => {
  test("GetCharts_OrderByNameAsc_Success", async ({ request }) => {
    // Act
    const response = await request.get(
      `${TestConstants.API_ENDPOINTS.CHARTS}?orderBy=name&order=asc`,
    );
    const { charts } = await response.json();
    const names = charts.map((c: any) => c.name);
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    // Assert
    expect(response.status()).toBe(TestConstants.HTTP_STATUS.OK);
    expect(names).toEqual(sorted);
  });

  test("GetCharts_OrderByNameDesc_Success", async ({ request }) => {
    // Act
    const response = await request.get(
      `${TestConstants.API_ENDPOINTS.CHARTS}?orderBy=name&order=desc`,
    );
    const { charts } = await response.json();
    const names = charts.map((c: any) => c.name);
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    // Assert
    expect(response.status()).toBe(TestConstants.HTTP_STATUS.OK);
    expect(names).toEqual(sorted);
  });

  test("GetCharts_OrderByDateCreatedAsc_Success", async ({ request }) => {
    // Act
    const response = await request.get(
      `${TestConstants.API_ENDPOINTS.CHARTS}?orderBy=dateCreated&order=asc`,
    );
    const { charts } = await response.json();
    const created = charts.map((c: any) => c.created_at);
    const sorted = [...created].sort((a, b) => a - b);
    // Assert
    expect(response.status()).toBe(TestConstants.HTTP_STATUS.OK);
    expect(created).toEqual(sorted);
  });

  test("GetCharts_OrderByDateModifiedAsc_Success", async ({ request }) => {
    // Act
    const response = await request.get(
      `${TestConstants.API_ENDPOINTS.CHARTS}?orderBy=dateModified&order=asc`,
    );
    const { charts } = await response.json();
    const modified = charts.map((c: any) => c.modified_at);
    const sorted = [...modified].sort((a, b) => a - b);
    // Assert
    expect(response.status()).toBe(TestConstants.HTTP_STATUS.OK);
    expect(modified).toEqual(sorted);
  });

  test("GetCharts_OrderByDateModifiedDesc_Success", async ({ request }) => {
    // Act
    const response = await request.get(
      `${TestConstants.API_ENDPOINTS.CHARTS}?orderBy=dateModified&order=desc`,
    );
    const { charts } = await response.json();
    const modified = charts.map((c: any) => c.modified_at);
    const sorted = [...modified].sort((a, b) => b - a);
    // Assert
    expect(response.status()).toBe(TestConstants.HTTP_STATUS.OK);
    expect(modified).toEqual(sorted);
  });
  test("GetCharts_ShouldThrowError_WhenInvalidEndpoint", async ({
    request,
  }) => {
    const response = await request.get(
      `${TestConstants.API_ENDPOINTS.CHARTS_INVALID}`,
    );
    expect(response.status()).toBe(TestConstants.HTTP_STATUS.NOT_FOUND);
  });

  test("GetCharts_ShouldThrowError_WhenOrderByInvalid", async ({ request }) => {
    // Act
    const response = await request.get(
      `${TestConstants.API_ENDPOINTS.CHARTS}?orderBy=foo`,
    );
    const body = await response.json();
    // Assert
    expect(response.status()).toBe(TestConstants.HTTP_STATUS.BAD_REQUEST);
    expect(body).toHaveProperty("error");
    expect(body.error).toBe(
      TestConstants.ERROR_MESSAGES.BAD_REQUEST_PARAMETERS,
    );
  });

  test("GetCharts_ShouldThrowError_WhenInvalidOrder", async ({ request }) => {
    // Act
    const response = await request.get(
      `${TestConstants.API_ENDPOINTS.CHARTS}?orderBy=name&order=sideways`,
    );
    const body = await response.json();
    // Assert
    expect(response.status()).toBe(TestConstants.HTTP_STATUS.BAD_REQUEST);
    expect(body).toHaveProperty("error");
    expect(body.error).toBe(
      TestConstants.ERROR_MESSAGES.BAD_REQUEST_PARAMETERS,
    );
  });

  test("GetCharts_ShouldThrowError_WhenOrderByDateCreatedDesc", async ({
    request,
  }) => {
    // Act
    const response = await request.get(
      `${TestConstants.API_ENDPOINTS.CHARTS}?orderBy=dateCreated&order=desc`,
    );
    const body = await response.json();
    expect(response.status()).toBe(TestConstants.HTTP_STATUS.SERVER_ERROR);
    // Assert
    expect(body).toHaveProperty("error");
    expect(body.error).toBe(
      TestConstants.ERROR_MESSAGES.DATE_CREATED_DESC_NOT_IMPLEMENTED,
    );
  });

  test("GetCharts_ShouldReturnSameResults_WhenDatasetMutated", async ({
    request,
  }) => {
    // Act
    const firstSortCallResponse = await request.get(
      `${TestConstants.API_ENDPOINTS.CHARTS}?orderBy=dateCreated&order=asc`,
    );
    const firstCharts = (await firstSortCallResponse.json()).charts.map(
      (c: any) => c.name,
    );

    // mutate the dataset by calling the default sort (by name asc)
    await request.get(
      `${TestConstants.API_ENDPOINTS.CHARTS}?orderBy=name&order=asc`,
    );

    const secondSortCallResponse = await request.get(
      `${TestConstants.API_ENDPOINTS.CHARTS}?orderBy=dateCreated&order=asc`,
    );
    const afterCharts = (await secondSortCallResponse.json()).charts.map(
      (c: any) => c.name,
    );

    // Assert
    expect(afterCharts).toEqual(firstCharts);
  });
});
