const { test, expect } = require('@playwright/test');
const APIHelper = require('../../api-utilities/apiHelper');
const { generateBookingData } = require('../../../test-data/apitestData');
const playwrightConfig = require('../../playwright.api.config');

test.describe('Get Booking Tests', () => {
  let bookingId; // Only store the booking ID,
  let baseURL = playwrightConfig.use.baseURL;

  // Create test data before all tests
  test.beforeAll(async ({ request }) => {
    const apiHelper = new APIHelper(request, baseURL);
    const bookingData = generateBookingData();
    const createResponse = await apiHelper.createBooking(bookingData);
    bookingId = createResponse.bookingid;
  });

  test('should retrieve an existing booking', async ({ request }) => {
    const apiHelper = new APIHelper(request, baseURL);

    const response = await apiHelper.getBooking(bookingId);
    expect(response.ok()).toBeTruthy();
    const booking = await response.json();
  
    // Store the response for debugging
    apiHelper.storeJsonElement(booking, 'existingBookingTest', "success");
    
    expect(booking).toHaveProperty('firstname');
    expect(booking).toHaveProperty('lastname');
    expect(booking).toHaveProperty('totalprice');
    expect(booking).toHaveProperty('bookingdates.checkin');
    expect(booking).toHaveProperty('bookingdates.checkout');
  });

  test('should return 404 for non-existent booking', async ({ request }) => {
    const apiHelper = new APIHelper(request, baseURL);
    const nonExistentId = 999999;
    const response = await apiHelper.getBooking(nonExistentId);

    // Store the response for debugging
    apiHelper.storeJsonElement(response, 'nonExistentBookingTest', "success");
    expect(response.status()).toBe(404);
  });

});