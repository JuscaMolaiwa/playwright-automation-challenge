const { test, expect } = require('@playwright/test');
const APIHelper = require('../../api-utilities/apiHelper');
const { generateBookingData, defaultBookingPayload } = require('../../../test-data/apitestData');
const playwrightConfig = require('../../playwright.api.config');

test.describe('Create Booking Tests', () => {
  let apiHelper;
  let baseURL;

  test.beforeEach(async ({ request }) => {
    baseURL = playwrightConfig.use.baseURL;
    apiHelper = new APIHelper(request, baseURL); // Pass baseURL here
  });

  test('should create a new booking with valid data', async () => {
    const bookingData = generateBookingData();
    const response = await apiHelper.createBooking(bookingData);
    
    expect(response.booking).toMatchObject(bookingData);
    expect(typeof response.bookingid).toBe('number');
  });

  test('should create a booking with static payload', async () => {
    const response = await apiHelper.createBooking(defaultBookingPayload);
    expect(response.booking).toMatchObject(defaultBookingPayload);
  });

  test('should fail with missing required fields', async () => {
    const invalidData = { ...generateBookingData(), firstname: undefined };
    const response = await apiHelper.request.post(`${baseURL}/booking`, {
      data: invalidData
    });
    expect(response.ok()).toBeFalsy();
  });
});