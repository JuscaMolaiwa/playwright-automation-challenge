const { test, expect } = require('@playwright/test');
const APIHelper = require('../../api-utilities/apiHelper');
const { generateBookingData, defaultBookingPayload } = require('../../../test-data/apitestData');

test.describe('Create Booking Tests', () => {
  let apiHelper;

  test.beforeEach(async ({ request }) => {
    apiHelper = new APIHelper(request);
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

  test('should fail with missing required fields', async ({ request }) => {
    const invalidData = { ...generateBookingData(), firstname: undefined };
    const response = await request.post('/booking', {
      data: invalidData
    });
    expect(response.ok()).toBeFalsy();
  });
});