// --- auth/auth.spec.js ---
const { post } = require('../utils/requestHelper');
const { credentials } = require('../utils/testData');

test('Generate auth token', async () => {
  const response = await post('/auth', credentials);
  expect(response.statusCode).toBe(200);
  expect(response.body).toHaveProperty('token');
});
