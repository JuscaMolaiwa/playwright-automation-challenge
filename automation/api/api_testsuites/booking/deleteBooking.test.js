const { test, expect } = require('@playwright/test');
const APIHelper = require('../../api-utilities/apiHelper');
const { generateBookingData } = require('../../../test-data/apitestData');
const playwrightConfig = require('../../playwright.api.config');

test.describe('Delete Booking Tests', () => {
  let apiHelper;
  let baseURL;
  let bookingId;
  let token;

  test.beforeEach(async ({ request }) => {
    baseURL = playwrightConfig.use.baseURL;
    apiHelper = new APIHelper(request, baseURL);
    
    // Create a booking to delete
    const bookingData = generateBookingData();
    const createResponse = await apiHelper.createBooking(bookingData);
    bookingId = createResponse.bookingid;
    
    // Get auth token
    const tokenData = await apiHelper.generateAuthToken();
    token = tokenData.token;
  });

  test('should delete an existing booking', async () => {
    // Delete the booking
    await apiHelper.deleteBooking(bookingId, token);
    
    // Verify booking is deleted
    const response = await apiHelper.getBooking(bookingId);
    expect(response.status()).toBe(404);
  });

  test('should fail to delete without auth token', async () => {
    const response = await apiHelper.request.delete(`${baseURL}/booking/${bookingId}`);
    expect(response.status()).toBe(403);
  });
});