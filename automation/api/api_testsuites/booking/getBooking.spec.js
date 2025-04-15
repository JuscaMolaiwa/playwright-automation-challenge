// --- booking/createBooking.test.js ---
const { post } = require('../../utils/requestHelper');
const { validBooking } = require('../../utils/testData');

test('Create a booking successfully', async () => {
  const response = await post('/booking', validBooking);
  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty('bookingid');
});