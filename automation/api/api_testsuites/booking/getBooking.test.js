const { test, expect } = require('@playwright/test');
const APIHelper = require('../../api-utilities/apiHelper');
const { generateBookingData } = require('../../../test-data/apitestData');

test.describe('Get Booking Tests', () => {
  let apiHelper;
  let bookingId;

  test.beforeAll(async ({ request }) => {
    apiHelper = new APIHelper(request);
    const bookingData = generateBookingData();
    const response = await apiHelper.createBooking(bookingData);
    bookingId = response.bookingid;
  });

  test('should retrieve an existing booking', async () => {
    const response = await apiHelper.getBooking(bookingId);
    expect(response.ok()).toBeTruthy();
    
    const booking = await response.json();
    expect(booking).toHaveProperty('firstname');
    expect(booking).toHaveProperty('lastname');
    expect(booking).toHaveProperty('totalprice');
  });

  test('should return 404 for non-existent booking', async () => {
    const response = await apiHelper.getBooking(999999);
    expect(response.status()).toBe(404);
  });
});