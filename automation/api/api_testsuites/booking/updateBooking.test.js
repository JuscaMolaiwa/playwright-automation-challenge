const { test, expect } = require('@playwright/test');
const APIHelper = require('../../api-utilities/apiHelper');
const { generateBookingData } = require('../../../test-data/apitestData');

test.describe('Update Booking Tests', () => {
  let apiHelper;
  let bookingId;
  let token;

  test.beforeAll(async ({ request }) => {
    apiHelper = new APIHelper(request);
    const bookingData = generateBookingData();
    const createResponse = await apiHelper.createBooking(bookingData);
    bookingId = createResponse.bookingid;
    
    const tokenData = await apiHelper.generateAuthToken();
    token = tokenData.token;
  });

  test('should update a booking with PUT', async () => {
    const updatedData = generateBookingData();
    const response = await apiHelper.updateBooking(bookingId, updatedData, token);
    
    expect(response).toMatchObject(updatedData);
  });

  test('should partially update a booking with PATCH', async () => {
    const partialUpdate = { firstname: 'UpdatedName', totalprice: 999 };
    const response = await apiHelper.updateBooking(bookingId, partialUpdate, token, 'patch');
    
    expect(response.firstname).toBe(partialUpdate.firstname);
    expect(response.totalprice).toBe(partialUpdate.totalprice);
  });
});