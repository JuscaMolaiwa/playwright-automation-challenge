const { test, expect } = require('@playwright/test');
const APIHelper = require('../../utils/apiHelper');
const { generateBookingData } = require('../../../test-data/apitestData');

test.describe('Delete Booking Tests', () => {
  let apiHelper;
  let bookingId;
  let token;

  test.beforeEach(async ({ request }) => {
    apiHelper = new APIHelper(request);
    const bookingData = generateBookingData();
    const createResponse = await apiHelper.createBooking(bookingData);
    bookingId = createResponse.bookingid;
    
    const tokenData = await apiHelper.generateAuthToken();
    token = tokenData.token;
  });

  test('should delete an existing booking', async () => {
    await apiHelper.deleteBooking(bookingId, token);
    
    const response = await apiHelper.getBooking(bookingId);
    expect(response.status()).toBe(404);
  });

  test('should fail to delete without auth token', async ({ request }) => {
    const response = await request.delete(`/booking/${bookingId}`);
    expect(response.status()).toBe(403);
  });
});