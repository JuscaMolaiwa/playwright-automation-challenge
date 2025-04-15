const { test, expect } = require('@playwright/test');
const APIHelper = require('../../api-utilities/apiHelper');
const { generateBookingData } = require('../../../test-data/apitestData');
const playwrightConfig = require('../../playwright.api.config');
test.describe('Update Booking Tests', () => {
  let apiHelper;
  let baseURL;
  let bookingId;
  let token;

  test.beforeEach(async ({ request }) => {
    baseURL = playwrightConfig.use.baseURL;
    apiHelper = new APIHelper(request, baseURL);
    
    // Create a test booking
    const bookingData = generateBookingData();
    const createResponse = await apiHelper.createBooking(bookingData);
    bookingId = createResponse.bookingid;
    
    // Get auth token
    const tokenData = await apiHelper.generateAuthToken();
    token = tokenData.token;
  });

  test('should update a booking with PUT', async () => {
    const updatedData = generateBookingData();
    const response = await apiHelper.updateBooking(bookingId, updatedData, token, 'put');

    apiHelper.storeJsonElement(response, 'bookingWithPutTest', "success");
    
    expect(response).toMatchObject(updatedData);
  });

  test('should partially update a booking with PATCH', async () => {
    const partialUpdate = { 
      firstname: 'UpdatedName', 
      totalprice: 999 
    };
    const response = await apiHelper.updateBooking(bookingId, partialUpdate, token, 'patch');

    // Store the response for debugging
    apiHelper.storeJsonElement(response, 'bookingWithPatchTest', "success");
    
    expect(response.firstname).toBe(partialUpdate.firstname);
    expect(response.totalprice).toBe(partialUpdate.totalprice);
  });
});